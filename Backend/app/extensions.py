# app/extensions.py

from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from authlib.integrations.flask_client import OAuth

# SQLAlchemy for DB
db = SQLAlchemy()

# Flask-Mail for sending emails
mail = Mail()

# JWT for authentication
jwt = JWTManager()

# Flask-Migrate for database migrations
migrate = Migrate()

# OAuth client (Google, etc.)
oauth = OAuth()  # ✅ Initialized later with app in create_app()
