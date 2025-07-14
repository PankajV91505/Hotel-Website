from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, mail, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Mailtrap configuration
    app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
    app.config['MAIL_PORT'] = 2525
    app.config['MAIL_USERNAME'] = '99147f218638c3'
    app.config['MAIL_PASSWORD'] = '7d29fdd6299d04'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_DEFAULT_SENDER'] = 'no-reply@hotelbooking.com'

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.rooms import rooms_bp
    from .routes.bookings import bookings_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')

    return app