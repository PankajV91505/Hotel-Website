from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255))
    otp = db.Column(db.String(6))
    is_google_user = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)  # Added
    is_admin = db.Column(db.Boolean, default=False)    # Added

    def __init__(self, first_name, last_name, email, password, otp=None, is_google_user=False, is_verified=False, is_admin=False):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.set_password(password)
        self.otp = otp
        self.is_google_user = is_google_user
        self.is_verified = is_verified
        self.is_admin = is_admin

    def set_password(self, password):
        if password:
            self.password = generate_password_hash(password)
        else:
            self.password = ''

    def check_password(self, password):
        if not self.password:
            return False
        return check_password_hash(self.password, password)