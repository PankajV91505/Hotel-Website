from ..extensions import db

class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    availability = db.Column(db.Boolean, default=True)

    # 🔥 ADD THIS LINE:
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
