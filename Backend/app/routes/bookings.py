from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.booking import Booking
from ..models.room import Room
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/', methods=['GET'])
@jwt_required()
def get_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': booking.id,
        'room_id': booking.room_id,
        'start_date': booking.start_date.isoformat(),
        'end_date': booking.end_date.isoformat(),
        'total_price': booking.total_price
    } for booking in bookings]), 200

@bookings_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    room_id = data.get('room_id')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    if not all([room_id, start_date, end_date]):
        return jsonify({'message': 'Missing required fields'}), 400

    room = Room.query.get_or_404(room_id)
    if not room.available:
        return jsonify({'message': 'Room not available'}), 400

    try:
        start_date = datetime.fromisoformat(start_date)
        end_date = datetime.fromisoformat(end_date)
    except ValueError:
        return jsonify({'message': 'Invalid date format'}), 400

    days = (end_date - start_date).days
    if days <= 0:
        return jsonify({'message': 'End date must be after start date'}), 400

    total_price = room.price * days
    booking = Booking(user_id=user_id, room_id=room_id, start_date=start_date, end_date=end_date, total_price=total_price)
    room.available = False
    db.session.add(booking)
    db.session.commit()
    return jsonify({'message': 'Booking created', 'id': booking.id}), 201

@bookings_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_booking(id):
    user_id = get_jwt_identity()
    booking = Booking.query.get_or_404(id)
    if booking.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    return jsonify({
        'id': booking.id,
        'room_id': booking.room_id,
        'start_date': booking.start_date.isoformat(),
        'end_date': booking.end_date.isoformat(),
        'total_price': booking.total_price
    }), 200

@bookings_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_booking(id):
    user_id = get_jwt_identity()
    booking = Booking.query.get_or_404(id)
    if booking.user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    room = Room.query.get(booking.room_id)
    room.available = True
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted'}), 200