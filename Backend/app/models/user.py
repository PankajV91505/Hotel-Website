from ..extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255))  # Allow null for Google OAuth users
    otp = db.Column(db.String(6))
    
    rooms = db.relationship('Room', backref='creator', lazy=True)

    def __init__(self, first_name, last_name, email, password=''):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        if password:
            self.set_password(password)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        if not self.password:  # Google OAuth users have no password
            return False
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.email}>'


