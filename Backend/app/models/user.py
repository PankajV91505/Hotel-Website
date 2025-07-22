from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255))
    phone_number = db.Column(db.String(15), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    otp = db.Column(db.String(6), nullable=True)
    is_google_user = db.Column(db.Boolean, default=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)

    def __init__(
        self,
        first_name,
        last_name,
        email,
        password=None,
        otp=None,
        is_google_user=False,
        is_verified=False,
        is_admin=False,
        phone_number=None,
        location=None
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.set_password(password)
        self.otp = otp
        self.is_google_user = is_google_user
        self.is_verified = is_verified
        self.is_admin = is_admin
        self.phone_number = phone_number
        self.location = location

    def set_password(self, password):
        if password:
            self.password = generate_password_hash(password)
        else:
            self.password = ''

    def check_password(self, password):
        if not self.password:
            return False
        return check_password_hash(self.password, password)
