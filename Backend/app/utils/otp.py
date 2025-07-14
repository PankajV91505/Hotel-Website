from ..extensions import db
import random
import string
from datetime import datetime, timedelta

class Otp(db.Model):
    __tablename__ = 'otps'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def store_otp(email, otp):
    # Remove existing OTPs for this email
    Otp.query.filter_by(email=email).delete()
    otp_entry = Otp(email=email, otp=otp, created_at=datetime.utcnow())
    db.session.add(otp_entry)
    db.session.commit()

def verify_otp(email, otp):
    otp_entry = Otp.query.filter_by(email=email, otp=otp).first()
    if otp_entry:
        # Check if OTP is not older than 10 minutes
        if datetime.utcnow() < otp_entry.created_at + timedelta(minutes=10):
            return True
    return False