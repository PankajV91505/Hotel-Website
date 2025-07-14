from flask import Blueprint, request, jsonify
from ..extensions import db, jwt, mail
from ..models.user import User
from ..utils.otp import generate_otp, store_otp, verify_otp
from ..utils.email import send_otp_email
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
import logging
from sqlalchemy.exc import SQLAlchemyError

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    logger.debug('Received signup request')
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, email, password]):
        logger.error('Missing required fields')
        return jsonify({'message': 'First name, last name, email, and password are required'}), 400

    if User.query.filter_by(email=email).first():
        logger.warning(f'Email already exists: {email}')
        return jsonify({'message': 'Email already exists'}), 400

    user = User(first_name=first_name, last_name=last_name, email=email)
    user.set_password(password)
    db.session.add(user)
    try:
        db.session.commit()
    except SQLAlchemyError as e:
        logger.error(f'Database error during user creation: {str(e)}')
        db.session.rollback()
        return jsonify({'message': 'Failed to create user'}), 500

    otp = generate_otp()
    try:
        store_otp(email, otp)
    except SQLAlchemyError as e:
        logger.error(f'Database error during OTP storage: {str(e)}')
        db.session.rollback()
        return jsonify({'message': 'Failed to store OTP'}), 500

    if not send_otp_email(email, otp):
        logger.error(f'Failed to send OTP email to {email}')
        return jsonify({'message': 'Failed to send OTP email'}), 500

    logger.info(f'User created and OTP sent to {email}')
    return jsonify({'message': 'User created. OTP sent to email'}), 201

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    logger.debug('Received OTP verification request')
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    if verify_otp(email, otp):
        user = User.query.filter_by(email=email).first()
        user.is_verified = True
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            logger.error(f'Database error during OTP verification: {str(e)}')
            db.session.rollback()
            return jsonify({'message': 'Failed to verify OTP'}), 500
        access_token = create_access_token(identity=user.id)
        logger.info(f'Email verified for {email}')
        return jsonify({'message': 'Email verified', 'access_token': access_token}), 200
    logger.warning(f'Invalid OTP for {email}')
    return jsonify({'message': 'Invalid OTP'}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    logger.debug('Received login request')
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password) and user.is_verified:
        access_token = create_access_token(identity=user.id)
        logger.info(f'Login successful for {email}')
        return jsonify({'access_token': access_token}), 200
    logger.warning(f'Invalid credentials or email not verified for {email}')
    return jsonify({'message': 'Invalid credentials or email not verified'}), 401

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    logger.debug('Received forgot password request')
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        logger.warning(f'Email not found: {email}')
        return jsonify({'message': 'Email not found'}), 404

    otp = generate_otp()
    try:
        store_otp(email, otp)
    except SQLAlchemyError as e:
        logger.error(f'Database error during OTP storage: {str(e)}')
        db.session.rollback()
        return jsonify({'message': 'Failed to store OTP'}), 500

    if not send_otp_email(email, otp):
        logger.error(f'Failed to send OTP email to {email}')
        return jsonify({'message': 'Failed to send OTP email'}), 500
    logger.info(f'OTP sent to {email}')
    return jsonify({'message': 'OTP sent to email'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    logger.debug('Received reset password request')
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    if verify_otp(email, otp):
        user = User.query.filter_by(email=email).first()
        user.set_password(new_password)
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            logger.error(f'Database error during password reset: {str(e)}')
            db.session.rollback()
            return jsonify({'message': 'Failed to reset password'}), 500
        logger.info(f'Password reset successful for {email}')
        return jsonify({'message': 'Password reset successful'}), 200
    logger.warning(f'Invalid OTP for {email}')
    return jsonify({'message': 'Invalid OTP'}), 400