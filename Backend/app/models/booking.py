from ..extensions import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    guest_name = db.Column(db.String(100), nullable=False)
    government_id = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_id = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='bookings')
    room = db.relationship('Room', backref='bookings')