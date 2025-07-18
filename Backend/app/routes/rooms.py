from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.room import Room
from ..models.user import User
import logging

logging.basicConfig(
    level=logging.DEBUG,
    filename='app.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

rooms_bp = Blueprint('rooms', __name__)

VALID_ROOM_TYPES = ['Single', 'Double', 'Twin', 'Queen', 'King', 'Suites']

@rooms_bp.route('', methods=['GET'])
def get_rooms():
    logger.debug('Fetching all rooms')
    rooms = Room.query.all()
    return jsonify([{
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'room_type': room.room_type,
        'is_ac': room.is_ac,
        'has_parking': room.has_parking,
        'availability': room.availability,
        'created_at': room.created_at.isoformat()
    } for room in rooms]), 200

@rooms_bp.route('', methods=['POST', 'OPTIONS'])
@jwt_required()
def create_room():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        logger.warning(f'Unauthorized room creation attempt by user_id: {user_id}')
        return jsonify({'message': 'Admin access required'}), 403

    data = request.get_json() or {}
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    room_type = data.get('room_type')
    is_ac = data.get('is_ac', False)
    has_parking = data.get('has_parking', False)
    availability = data.get('availability', True)

    if not all([name, description, price, room_type]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields', 'fields': data}), 400

    if room_type not in VALID_ROOM_TYPES:
        logger.error(f'Invalid room type: {room_type}')
        return jsonify({'message': f'Invalid room type. Must be one of: {", ".join(VALID_ROOM_TYPES)}'}), 400

    try:
        room = Room(
            name=name,
            description=description,
            price=price,
            room_type=room_type,
            is_ac=is_ac,
            has_parking=has_parking,
            availability=availability
        )
        db.session.add(room)
        db.session.commit()
        logger.info(f'Room created: {name}')
        return jsonify({'message': 'Room created successfully'}), 201
    except Exception as e:
        logger.error(f'Error creating room: {str(e)}')
        db.session.rollback()
        return jsonify({'message': f'Failed to create room: {str(e)}'}), 500

@rooms_bp.route('/<int:id>', methods=['GET'])
def get_room(id):
    logger.debug(f'Fetching room: {id}')
    room = Room.query.get(id)
    if not room:
        logger.warning(f'Room not found: {id}')
        return jsonify({'message': 'Room not found'}), 404
    return jsonify({
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'room_type': room.room_type,
        'is_ac': room.is_ac,
        'has_parking': room.has_parking,
        'availability': room.availability,
        'created_at': room.created_at.isoformat()
    }), 200

@rooms_bp.route('/<int:id>', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_room(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        logger.warning(f'Unauthorized room update attempt by user_id: {user_id}')
        return jsonify({'message': 'Admin access required'}), 403

    room = Room.query.get(id)
    if not room:
        logger.warning(f'Room not found: {id}')
        return jsonify({'message': 'Room not found'}), 404

    data = request.get_json() or {}
    room_type = data.get('room_type', room.room_type)

    if room_type and room_type not in VALID_ROOM_TYPES:
        logger.error(f'Invalid room type: {room_type}')
        return jsonify({'message': f'Invalid room type. Must be one of: {", ".join(VALID_ROOM_TYPES)}'}), 400

    room.name = data.get('name', room.name)
    room.description = data.get('description', room.description)
    room.price = data.get('price', room.price)
    room.room_type = room_type
    room.is_ac = data.get('is_ac', room.is_ac)
    room.has_parking = data.get('has_parking', room.has_parking)
    room.availability = data.get('availability', room.availability)

    try:
        db.session.commit()
        logger.info(f'Room updated: {room.name}')
        return jsonify({'message': 'Room updated successfully'}), 200
    except Exception as e:
        logger.error(f'Error updating room: {str(e)}')
        db.session.rollback()
        return jsonify({'message': f'Failed to update room: {str(e)}'}), 500

@rooms_bp.route('/<int:id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_room(id):
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        logger.warning(f'Unauthorized room deletion attempt by user_id: {user_id}')
        return jsonify({'message': 'Admin access required'}), 403

    room = Room.query.get(id)
    if not room:
        logger.warning(f'Room not found: {id}')
        return jsonify({'message': 'Room not found'}), 404

    try:
        db.session.delete(room)
        db.session.commit()
        logger.info(f'Room deleted: {id}')
        return jsonify({'message': 'Room deleted successfully'}), 200
    except Exception as e:
        logger.error(f'Error deleting room: {str(e)}')
        db.session.rollback()
        return jsonify({'message': f'Failed to delete room: {str(e)}'}), 500