from ..extensions import db
from datetime import datetime

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    room_type = db.Column(db.String(50), nullable=False)  # Single, Double, Twin, Queen, King, Suites
    is_ac = db.Column(db.Boolean, default=False)          # AC or Non-AC
    has_parking = db.Column(db.Boolean, default=False)    # Parking availability
    availability = db.Column(db.Boolean, default=True)    # General availability
    created_at = db.Column(db.DateTime, default=datetime.utcnow)