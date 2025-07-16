from flask import Blueprint, request, jsonify, redirect, url_for, session
from flask_jwt_extended import create_access_token
from ..extensions import db, mail, jwt, oauth
from ..models.user import User
from ..config import Config
from flask_mail import Message
from sqlalchemy.exc import IntegrityError
import random
import string
import logging
import traceback

logging.basicConfig(level=logging.DEBUG)
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
    return google.authorize_redirect(redirect_uri)

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
                first_name=name.split()[0] if name else '',
                last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
                password=''
            )
            db.session.add(user)
            try:
                db.session.commit()
                logger.info(f'New user created: {email}')
            except IntegrityError:
                db.session.rollback()
                logger.error(f'Duplicate email: {email}')
                return jsonify({'message': 'Email already exists'}), 400

        access_token = create_access_token(identity=user.id)
        logger.info(f'Google login successful for {email}')
        session['jwt_token'] = access_token
        return redirect('http://localhost:5173/callback')

    except Exception as e:
        logger.error(f'Google OAuth error: {str(e)}\n{traceback.format_exc()}')
        return jsonify({'message': 'Authentication failed'}), 500

@auth_bp.route('/get-token', methods=['GET'])
def get_token():
    token = session.pop('jwt_token', None)
    if not token:
        return jsonify({'message': 'No token found'}), 400
    return jsonify({'access_token': token}), 200

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/auth/signup')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    logger.debug('Received signup request')
    data = request.get_json()
    logger.debug(f'Signup data: {data}')
    first_name = data.get('firstName')  # Updated to match frontend
    last_name = data.get('lastName')   # Updated to match frontend
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, email, password]):
        logger.error(f'Missing required fields: {data}')
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        user = User.query.filter_by(email=email).first()
        if user:
            logger.warning(f'Email already exists: {email}')
            return jsonify({'message': 'Email already exists'}), 400

        otp = ''.join(random.choices(string.digits, k=6))
        logger.debug(f'Creating user: {email}, OTP: {otp}')
        user = User(first_name=first_name, last_name=last_name, email=email, password=password, otp=otp)
        db.session.add(user)
        db.session.commit()
        logger.debug(f'User {email} added to database')

        msg = Message('Your OTP Code', sender=Config.MAIL_USERNAME, recipients=[email])
        msg.body = f'Your OTP code is {otp}. Please use this to verify your account.'
        mail.send(msg)
        logger.info(f'OTP sent to {email}')
        return jsonify({'message': 'OTP sent to your email'}), 201
    except Exception as e:
        logger.error(f'Error during signup: {str(e)}\n{traceback.format_exc()}')
        db.session.rollback()
        return jsonify({'message': 'Failed to sign up'}), 500

@auth_bp.route('/verify-otp', methods=['POST', 'OPTIONS'])
def verify_otp():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/auth/verify-otp')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    logger.debug('Received OTP verification request')
    data = request.get_json()
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
    db.session.commit()
    access_token = create_access_token(identity=user.id)
    logger.info(f'OTP verified for {email}')
    return jsonify({'message': 'OTP verified', 'access_token': access_token}), 200

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/auth/login')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    logger.debug('Received login request')
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        logger.warning(f'Invalid login attempt for {email}')
        return jsonify({'message': 'Invalid email or password'}), 401

    if user.otp:
        logger.warning(f'Account not verified for {email}')
        return jsonify({'message': 'Account not verified. Please verify your OTP.'}), 403

    access_token = create_access_token(identity=user.id)
    logger.info(f'Login successful for {email}')
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

@auth_bp.route('/forgot-password', methods=['POST', 'OPTIONS'])
def forgot_password():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/auth/forgot-password')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    logger.debug('Received forgot password request')
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        logger.warning(f'Email not found: {email}')
        return jsonify({'message': 'Email not found'}), 404

    otp = ''.join(random.choices(string.digits, k=6))
    user.otp = otp
    db.session.commit()

    msg = Message('Password Reset OTP', sender=Config.MAIL_USERNAME, recipients=[email])
    msg.body = f'Your OTP for password reset is {otp}.'
    mail.send(msg)
    logger.info(f'Password reset OTP sent to {email}')
    return jsonify({'message': 'OTP sent to your email'}), 200

@auth_bp.route('/reset-password', methods=['POST', 'OPTIONS'])
def reset_password():
    if request.method == 'OPTIONS':
        logger.debug('Handling OPTIONS request for /api/auth/reset-password')
        return jsonify({}), 200, {
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    logger.debug('Received reset password request')
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    user = User.query.filter_by(email=email).first()
    if not user or user.otp != otp:
        logger.warning(f'Invalid OTP for password reset: {email}')
        return jsonify({'message': 'Invalid OTP'}), 400

    user.set_password(new_password)
    user.otp = None
    db.session.commit()
    logger.info(f'Password reset successful for {email}')
    return jsonify({'message': 'Password reset successful'}), 200