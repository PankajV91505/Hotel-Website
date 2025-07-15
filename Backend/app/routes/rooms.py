from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.room import Room
import logging
from sqlalchemy.exc import IntegrityError

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/', methods=['GET', 'OPTIONS'])
def get_rooms():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/rooms')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
    logger.debug('Received request to fetch rooms')
    try:
        rooms = Room.query.all()
        return jsonify([{
            'id': room.id,
            'name': room.name,
            'description': room.description,
            'price': room.price,
            'capacity': room.capacity,
            'available': room.available,
            'created_at': room.created_at.isoformat() if room.created_at else None
        } for room in rooms]), 200
    except Exception as e:
        logger.error(f'Error fetching rooms: {str(e)}')
        return jsonify({'message': 'Failed to fetch rooms'}), 500

@rooms_bp.route('/', methods=['POST', 'OPTIONS'])
@jwt_required()
def create_room():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/rooms')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
    logger.debug('Received request to add room')
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    capacity = data.get('capacity')
    available = data.get('available', True)

    if not all([name, price, capacity]):
        logger.error('Missing required fields')
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        room = Room(name=name, description=description, price=price, capacity=capacity, available=available, created_by=user_id)
        db.session.add(room)
        db.session.commit()
        logger.info(f'Room {name} created by user {user_id}')
        return jsonify({'message': 'Room created', 'id': room.id}), 201
    except IntegrityError:
        db.session.rollback()
        logger.warning(f'Room creation failed: Duplicate name {name}')
        return jsonify({'message': 'Room name already exists'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f'Error adding room: {str(e)}')
        return jsonify({'message': 'Failed to add room'}), 500

@rooms_bp.route('/<int:id>', methods=['GET', 'OPTIONS'])
def get_room(id):
    if request.method == 'OPTIONS':
        logger.debug(f'Handling OPTIONS request for /api/rooms/{id}')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
    logger.debug(f'Received request to fetch room {id}')
    room = Room.query.get_or_404(id)
    return jsonify({
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'capacity': room.capacity,
        'available': room.available,
        'created_at': room.created_at.isoformat() if room.created_at else None
    }), 200

@rooms_bp.route('/<int:id>', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_room(id):
    if request.method == 'OPTIONS':
        logger.debug(f'Handling OPTIONS request for /api/rooms/{id}')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
    logger.debug(f'Received request to update room {id}')
    user_id = get_jwt_identity()
    room = Room.query.get_or_404(id)
    if room.created_by != user_id:
        logger.warning(f'Unauthorized attempt to update room {id} by user {user_id}')
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    room.name = data.get('name', room.name)
    room.description = data.get('description', room.description)
    room.price = data.get('price', room.price)
    room.capacity = data.get('capacity', room.capacity)
    room.available = data.get('available', room.available)
    try:
        db.session.commit()
        logger.info(f'Room {id} updated by user {user_id}')
        return jsonify({'message': 'Room updated'}), 200
    except IntegrityError:
        db.session.rollback()
        logger.warning(f'Room update failed: Duplicate name {room.name}')
        return jsonify({'message': 'Room name already exists'}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f'Error updating room {id}: {str(e)}')
        return jsonify({'message': 'Failed to update room'}), 500

@rooms_bp.route('/<int:id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_room(id):
    if request.method == 'OPTIONS':
        logger.debug(f'Handling OPTIONS request for /api/rooms/{id}')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }
    logger.debug(f'Received request to delete room {id}')
    user_id = get_jwt_identity()
    room = Room.query.get_or_404(id)
    if room.created_by != user_id:
        logger.warning(f'Unauthorized attempt to delete room {id} by user {user_id}')
        return jsonify({'message': 'Unauthorized'}), 403

    try:
        db.session.delete(room)
        db.session.commit()
        logger.info(f'Room {id} deleted by user {user_id}')
        return jsonify({'message': 'Room deleted'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f'Error deleting room {id}: {str(e)}')
        return jsonify({'message': 'Failed to delete room'}), 500