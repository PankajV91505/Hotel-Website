from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from ..extensions import db, mail, jwt, oauth
from ..models.user import User
from ..config import Config
from flask_mail import Message
from sqlalchemy.exc import IntegrityError
import random
import string
import logging
import traceback

logging.basicConfig(
    level=logging.DEBUG,
    filename='app.log',
    filemode='a',
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

google = oauth.register(
    name='google',
    client_id=Config.GOOGLE_CLIENT_ID,
    client_secret=Config.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@auth_bp.route('/google', methods=['GET'])
def google_login():
    logger.debug('Initiating Google OAuth login')
    redirect_uri = url_for('auth.google_callback', _external=True)
    try:
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        logger.error(f'Google OAuth redirect error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'message': 'Failed to initiate Google login'}), 500

@auth_bp.route('/google/callback', methods=['GET'])
def google_callback():
    try:
        logger.debug('Handling Google OAuth callback')
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        if not user_info:
            logger.error('Failed to fetch user info from Google')
            return jsonify({'message': 'Failed to fetch user info'}), 400

        email = user_info.get('email')
        name = user_info.get('name', '')
        google_id = user_info.get('sub')

        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                first_name=name.split()[0] if name else 'Google',
                last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else 'User',
                password='',
                is_google_user=True,
                is_verified=True,
                phone_number='',
                location=''
            )
            db.session.add(user)
            try:
                db.session.commit()
                logger.info(f'New Google user created: {email}')
            except IntegrityError:
                db.session.rollback()
                logger.error(f'Duplicate email: {email}')
                return jsonify({'message': 'Email already exists'}), 400

        if not user.id:
            logger.error(f'User ID is None for email: {email}')
            return jsonify({'message': 'User creation failed'}), 500

        access_token = create_access_token(identity=str(user.id))
        logger.info(f'Google login successful for {email}, token: {access_token}')
        return redirect(f'http://localhost:5173/callback?access_token={access_token}')
    except Exception as e:
        logger.error(f'Google OAuth error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'message': 'Authentication failed'}), 500

@auth_bp.route('/get-token', methods=['GET'])
def get_token():
    token = session.pop('jwt_token', None)
    if not token:
        logger.warning('No token found in session')
        return jsonify({'message': 'No token found'}), 400
    logger.info(f'Retrieved token from session: {token}')
    return jsonify({'access_token': token}), 200

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    logger.debug('Received signup request')
    data = request.get_json() or {}
    logger.debug(f'Signup data: {data}')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, email, password]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields', 'fields': data}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if user:
            logger.warning(f'Email already exists: {email}')
            return jsonify({'message': 'Email already exists'}), 400

        otp = ''.join(random.choices(string.digits, k=6))
        logger.debug(f'Creating user: {email}, OTP: {otp}')
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            otp=otp,
            is_verified=False,
            phone_number='',
            location=''
        )
        db.session.add(user)
        db.session.commit()
        logger.debug(f'User {email} added to database, id: {user.id}')

        msg = Message('Your OTP Code', sender=Config.MAIL_USERNAME, recipients=[email])
        msg.body = f'Your OTP code is {otp}. Please use this to verify your account.'
        try:
            mail.send(msg)
            logger.info(f'OTP sent to {email}')
            return jsonify({'message': 'OTP sent to your email'}), 201
        except Exception as e:
            logger.error(f'Failed to send OTP: {str(e)}\n{traceback.format_exc()}')
            db.session.rollback()
            return jsonify({'message': 'Failed to send OTP'}), 500
    except Exception as e:
        logger.error(f'Error during signup: {str(e)}\n{traceback.format_exc()}')
        db.session.rollback()
        return jsonify({'message': 'Failed to sign up'}), 500

@auth_bp.route('/verify-otp', methods=['POST', 'OPTIONS'])
def verify_otp():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    logger.debug('Received OTP verification request')
    data = request.get_json() or {}
    logger.debug(f'OTP verification data: {data}')
    email = data.get('email')
    otp = data.get('otp')

    if not all([email, otp]):
        logger.error(f'Missing email or OTP: {data}')
        return jsonify({'message': 'Missing email or OTP'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or user.otp != otp:
        logger.warning(f'Invalid OTP for {email}')
        return jsonify({'message': 'Invalid OTP'}), 400

    user.otp = None
    user.is_verified = True
    db.session.commit()
    access_token = create_access_token(identity=str(user.id))
    logger.info(f'OTP verified for {email}, token: {access_token}')
    return jsonify({'message': 'OTP verified', 'access_token': access_token}), 200

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    try:
        logger.debug('Received login request')
        data = request.get_json() or {}
        logger.debug(f'Login data: {data}')
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            logger.warning('Missing email or password in request')
            return jsonify({'message': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            logger.warning(f'User not found: {email}')
            return jsonify({'message': 'Invalid email or password'}), 401
        if user.is_google_user:
            logger.warning(f'Google user attempted password login: {email}')
            return jsonify({'message': 'Please use Google login for this account'}), 403
        if not user.check_password(password):
            logger.warning(f'Wrong password attempt for: {email}')
            return jsonify({'message': 'Invalid email or password'}), 401
        if not user.is_verified:
            logger.warning(f'Unverified account: {email}')
            return jsonify({'message': 'Account not verified. Please verify your OTP.'}), 403

        if not user.id:
            logger.error(f'User ID is None for email: {email}')
            return jsonify({'message': 'Invalid user data'}), 500

        access_token = create_access_token(identity=str(user.id))
        logger.info(f'Login successful for {email}, token: {access_token}')
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token
        }), 200
    except Exception as e:
        logger.error(f'Login error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'message': 'Something went wrong. Please try again later.'}), 500

@auth_bp.route('/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    logger.debug('Received forgot password request')
    data = request.get_json() or {}
    email = data.get('email')

    if not email:
        logger.error('Missing email field')
        return jsonify({'message': 'Missing email'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        logger.warning(f'Email not found: {email}')
        return jsonify({'message': 'Email not found'}), 404

    otp = ''.join(random.choices(string.digits, k=6))
    user.otp = otp
    try:
        db.session.commit()
        msg = Message('Password Reset OTP', sender=Config.MAIL_USERNAME, recipients=[email])
        msg.body = f'Your OTP for password reset is {otp}.'
        mail.send(msg)
        logger.info(f'Password reset OTP sent to {email}')
        return jsonify({'message': 'OTP sent to your email'}), 200
    except Exception as e:
        logger.error(f'Error sending OTP: {str(e)}\n{traceback.format_exc()}')
        db.session.rollback()
        return jsonify({'message': f'Failed to send OTP: {str(e)}'}), 500

@auth_bp.route('/reset-password', methods=['POST', 'OPTIONS'])
def reset_password():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization'
        }

    logger.debug('Received reset password request')
    data = request.get_json() or {}
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    if not all([email, otp, new_password]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing email, OTP, or new password'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or user.otp != otp:
        logger.warning(f'Invalid OTP for password reset: {email}')
        return jsonify({'message': 'Invalid OTP'}), 400

    try:
        user.set_password(new_password)
        user.otp = None
        user.is_verified = True
        db.session.commit()
        logger.info(f'Password reset successful for {email}')
        return jsonify({'message': 'Password reset successful'}), 200
    except Exception as e:
        logger.error(f'Error resetting password: {str(e)}\n{traceback.format_exc()}')
        db.session.rollback()
        return jsonify({'message': f'Failed to reset password: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_user_info():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'GET,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Credentials': 'true'
        }
    try:
        user_id = get_jwt_identity()
        logger.debug(f'Fetching user info for user_id: {user_id}')
        if not user_id or not isinstance(user_id, str):
            logger.error(f'Invalid user_id type: {type(user_id)}, value: {user_id}')
            return jsonify({'message': 'Invalid token: Subject must be a string'}), 422
        user = User.query.get(int(user_id))
        if not user:
            logger.warning(f'User not found: {user_id}')
            return jsonify({'message': 'User not found'}), 404
        logger.info(f'User info retrieved for {user.email}')
        return jsonify({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number or '',
            'location': user.location or '',
            'is_admin': user.is_admin
        }), 200
    except Exception as e:
        logger.error(f'Error in get_user_info: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'message': f'Failed to fetch user info: {str(e)}'}), 500
@auth_bp.route('/update-profile', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_profile():
    if request.method == 'OPTIONS':
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'PUT,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Credentials': 'true'
        }

    try:
        user_id = get_jwt_identity()
        logger.debug(f'Received update-profile request for user_id: {user_id}')
        user = User.query.get(int(user_id))

        if not user:
            logger.warning(f'User not found for update-profile: {user_id}')
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json() or {}
        logger.debug(f'Update data: {data}')

        phone_number = data.get('phone_number')
        location = data.get('location')

        if phone_number:
            user.phone_number = phone_number
        if location:
            user.location = location

        db.session.commit()
        logger.info(f'User profile updated successfully for {user.email}')
        return jsonify({'message': 'Profile updated successfully'}), 200

    except Exception as e:
        logger.error(f'Error updating profile: {str(e)}\n{traceback.format_exc()}')
        db.session.rollback()
        return jsonify({'message': 'Failed to update profile'}), 500
