from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models.booking import Booking
from ..models.room import Room
from datetime import datetime
import logging

logging.basicConfig(
    level=logging.DEBUG,
    filename='app.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('', methods=['POST', 'OPTIONS'])
@jwt_required()
def book_room():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    logger.debug('Received book room request')
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    room_id = data.get('room_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not all([room_id, start_date, end_date]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields', 'fields': data}), 400

    room = Room.query.get(room_id)
    if not room:
        logger.warning(f'Room not found: {room_id}')
        return jsonify({'message': 'Room not found'}), 404
    if not room.availability:
        logger.warning(f'Room not available: {room_id}')
        return jsonify({'message': 'Room not available'}), 400

    try:
        start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        if start_date >= end_date:
            logger.error(f'Invalid date range: start_date={start_date}, end_date={end_date}')
            return jsonify({'message': 'End date must be after start date'}), 400

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
        return jsonify({'message': f'Failed to book room: {str(e)}'}), 500

@bookings_bp.route('/my-bookings', methods=['GET'])
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