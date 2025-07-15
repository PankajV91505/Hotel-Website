# app/__init__.py

from flask import Flask, request, redirect
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, mail, migrate, oauth

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['STRICT_SLASHES'] = False

    # CORS setup
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    oauth.init_app(app)  # ✅ REQUIRED for Authlib

    # ✅ Register Google OAuth client (after oauth.init_app)
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.rooms import rooms_bp
    from .routes.bookings import bookings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')

    # Optional: Normalize trailing slashes in URLs
    @app.before_request
    def normalize_path():
        if request.path.endswith('/') and request.path != '/':
            if request.method == 'OPTIONS':
                request.environ['PATH_INFO'] = request.path.rstrip('/')
            else:
                return redirect(request.path.rstrip('/'), code=301)

    return app
