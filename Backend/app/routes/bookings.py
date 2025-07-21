from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db, mail
from ..models.booking import Booking
from ..models.room import Room
from ..models.user import User
from flask_mail import Message
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

# Mask Government ID (e.g., "344567kjd" -> "344***kjd")
def mask_govt_id(govt_id):
    if len(govt_id) < 6:
        return govt_id
    return govt_id[:3] + "***" + govt_id[-3:]

@bookings_bp.route('/create-order', methods=['POST', 'OPTIONS'])
def create_order():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    data = request.get_json() or {}
    amount = data.get('amount')

    if not amount:
        logger.error('Missing amount for order creation')
        return jsonify({'message': 'Amount is required'}), 400

    try:
        order_data = {
            'amount': int(float(amount) * 100),  # Convert to paise
            'currency': 'INR',
            'receipt': f'receipt_{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'payment_capture': 1  # Auto-capture
        }
        razorpay_client = current_app.config['RAZORPAY_CLIENT']
        order = razorpay_client.order.create(data=order_data)
        logger.info(f'Order created: {order["id"]}')
        return jsonify({
            'success': True,
            'order_id': order['id'],
            'amount': order['amount'],
            'currency': order['currency']
        }), 200
    except Exception as e:
        logger.error(f'Error creating order: {str(e)}')
        return jsonify({'message': f'Failed to create order: {str(e)}'}), 500

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
    guest_name = data.get('guest_name')
    government_id = data.get('government_id')
    phone_number = data.get('phone_number')
    amount = data.get('amount')
    payment_id = data.get('payment_id')

    if not all([room_id, start_date, end_date, guest_name, government_id, phone_number, amount, payment_id]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields', 'fields': data}), 400

    room = Room.query.get(room_id)
    if not room:
        logger.warning(f'Room not found: {room_id}')
        return jsonify({'message': 'Room not found'}), 404
    if not room.availability:
        logger.warning(f'Room not available: {room_id}')
        return jsonify({'message': 'Room not available'}), 400

    user = User.query.get(user_id)
    if not user:
        logger.warning(f'User not found: {user_id}')
        return jsonify({'message': 'User not found'}), 404

    try:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
        end_date = datetime.strptime(end_date, '%Y-%m-%d')
        if start_date >= end_date:
            logger.error(f'Invalid date range: start_date={start_date}, end_date={end_date}')
            return jsonify({'message': 'Check-out date must be after check-in date'}), 400
        if start_date.date() < datetime.now().date():
            logger.error(f'Cannot book in the past: start_date={start_date}')
            return jsonify({'message': 'Cannot book in the past'}), 400

        existing_bookings = Booking.query.filter(
            Booking.room_id == room_id,
            Booking.start_date < end_date,
            Booking.end_date > start_date
        ).all()
        if existing_bookings:
            logger.warning(f'Room {room_id} already booked for requested dates')
            return jsonify({'message': 'Room already booked for these dates'}), 400

        booking = Booking(
            user_id=user_id,
            room_id=room_id,
            start_date=start_date,
            end_date=end_date,
            guest_name=guest_name,
            government_id=government_id,
            phone_number=phone_number,
            amount=amount,
            payment_id=payment_id
        )
        room.availability = False
        db.session.add(booking)
        db.session.commit()
        logger.info(f'Room booked: room_id={room_id}, user_id={user_id}, payment_id={payment_id}')

        # Send confirmation email
        try:
            msg = Message(
                'Booking Confirmation',
                recipients=[user.email]
            )
            msg.body = (
                f'Dear {guest_name},\n\n'
                f'Your booking has been confirmed!\n'
                f'Room: {room.name} (ID: {room.id}, Type: {room.room_type})\n'
                f'Location: Hotel XYZ, City Center\n'
                f'Check-in: {start_date.strftime("%Y-%m-%d")}\n'
                f'Check-out: {end_date.strftime("%Y-%m-%d")}\n'
                f'Phone: {phone_number}\n'
                f'Government ID: {mask_govt_id(government_id)}\n'
                f'Amount Paid: ₹{amount:.2f}\n\n'
                f'Thank you for booking with us!'
            )
            mail.send(msg)
            logger.info(f'Booking confirmation email sent to {user.email}')
        except Exception as e:
            logger.error(f'Failed to send booking confirmation email: {str(e)}')
            return jsonify({
                'message': 'Room booked successfully, but failed to send confirmation email',
                'booking_id': booking.id,
                'payment_id': payment_id
            }), 201

        return jsonify({
            'message': 'Room booked successfully',
            'booking_id': booking.id,
            'payment_id': payment_id
        }), 201
    except ValueError as e:
        logger.error(f'Invalid date format: {str(e)}')
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
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
        'room_type': booking.room.room_type,
        'start_date': booking.start_date.isoformat(),
        'end_date': booking.end_date.isoformat(),
        'guest_name': booking.guest_name,
        'government_id': mask_govt_id(booking.government_id),
        'phone_number': booking.phone_number,
        'amount': booking.amount,
        'payment_id': booking.payment_id,
        'created_at': booking.created_at.isoformat()
    } for booking in bookings]), 200