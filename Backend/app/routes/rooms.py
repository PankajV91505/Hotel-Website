from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.room import Room
from ..models.user import User
from ..models.booking import Booking
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG, filename='app.log', filemode='a', format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/rooms', methods=['GET'])
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

@rooms_bp.route('/add-room', methods=['POST'])
@jwt_required()
def add_room():
    logger.debug('Received add room request')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        logger.warning(f'Unauthorized add room attempt by user_id: {user_id}')
        return jsonify({'message': 'Admin access required'}), 403

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    availability = data.get('availability', True)

    if not all([name, description, price]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        room = Room(name=name, description=description, price=price, availability=availability)
        db.session.add(room)
        db.session.commit()
        logger.info(f'Room added: {name}')
        return jsonify({'message': 'Room added successfully'}), 201
    except Exception as e:
        logger.error(f'Error adding room: {str(e)}')
        db.session.rollback()
        return jsonify({'message': 'Failed to add room'}), 500

@rooms_bp.route('/edit-room/<int:id>', methods=['PUT'])
@jwt_required()
def edit_room(id):
    logger.debug(f'Received edit room request for room_id: {id}')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        logger.warning(f'Unauthorized edit room attempt by user_id: {user_id}')
        return jsonify({'message': 'Admin access required'}), 403

    room = Room.query.get(id)
    if not room:
        logger.warning(f'Room not found: {id}')
        return jsonify({'message': 'Room not found'}), 404

    data = request.get_json()
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
        return jsonify({'message': 'Failed to update room'}), 500

@rooms_bp.route('/book-room', methods=['POST'])
@jwt_required()
def book_room():
    logger.debug('Received book room request')
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        logger.warning(f'User not found: {user_id}')
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    room_id = data.get('room_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not all([room_id, start_date, end_date]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields'}), 400

    room = Room.query.get(room_id)
    if not room:
        logger.warning(f'Room not found: {room_id}')
        return jsonify({'message': 'Room not found'}), 404
    if not room.availability:
        logger.warning(f'Room not available: {room_id}')
        return jsonify({'message': 'Room not available'}), 400

    try:
        start_date = datetime.fromisoformat(start_date)
        end_date = datetime.fromisoformat(end_date)
        if start_date >= end_date:
            logger.error(f'Invalid date range: start_date={start_date}, end_date={end_date}')
            return jsonify({'message': 'End date must be after start date'}), 400

        # Check for overlapping bookings
        existing_bookings = Booking.query.filter(
            Booking.room_id == room_id,
            Booking.start_date < end_date,
            Booking.end_date > start_date
        ).all()
        if existing_bookings:
            logger.warning(f'Room {room_id} already booked for requested dates')
            return jsonify({'message': 'Room already booked for these dates'}), 400

        booking = Booking(user_id=user_id, room_id=room_id, start_date=start_date, end_date=end_date)
        room.availability = False
        db.session.add(booking)
        db.session.commit()
        logger.info(f'Room booked: room_id={room_id}, user_id={user_id}')
        return jsonify({'message': 'Room booked successfully'}), 201
    except Exception as e:
        logger.error(f'Error booking room: {str(e)}')
        db.session.rollback()
        return jsonify({'message': 'Failed to book room'}), 500

@rooms_bp.route('/my-bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    logger.debug('Fetching user bookings')
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': booking.id,
        'room_id': booking.room_id,
        'room_name': booking.room.name,
        'start_date': booking.start_date.isoformat(),
        'end_date': booking.end_date.isoformat(),
        'created_at': booking.created_at.isoformat()
    } for booking in bookings]), 200