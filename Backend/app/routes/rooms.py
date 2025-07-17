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

@rooms_bp.route('', methods=['GET'])
def get_rooms():
    logger.debug('Fetching all rooms')
    rooms = Room.query.all()
    return jsonify([{
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'availability': room.availability
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
    availability = data.get('availability', True)

    if not all([name, description, price]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields', 'fields': data}), 400

    try:
        room = Room(name=name, description=description, price=price, availability=availability)
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
        'availability': room.availability
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
    room.name = data.get('name', room.name)
    room.description = data.get('description', room.description)
    room.price = data.get('price', room.price)
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