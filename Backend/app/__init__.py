# app/__init__.py

from flask import Flask, request, redirect
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, mail, migrate, oauth

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['STRICT_SLASHES'] = False

    # ✅ Enable CORS for frontend (Vite)
    CORS(app, origins="http://localhost:5173", supports_credentials=True)

    # ✅ Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    oauth.init_app(app)

    # ✅ Register Google OAuth
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

    # ✅ Register Blueprints
    from .routes.auth import auth_bp
    from .routes.rooms import rooms_bp
    from .routes.bookings import bookings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(rooms_bp, url_prefix='/api/rooms')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')

    # ✅ Normalize trailing slashes
    @app.before_request
    def normalize_path():
        if request.path.endswith('/') and request.path != '/':
            if request.method == 'OPTIONS':
                request.environ['PATH_INFO'] = request.path.rstrip('/')
            else:
                return redirect(request.path.rstrip('/'), code=301)

    # ✅ Add CORS headers even to error responses
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        return response

    return app
