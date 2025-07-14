from flask_mail import Message
from ..extensions import mail

def send_otp_email(email, otp):
    try:
        msg = Message(
            subject='Your OTP for Hotel Booking App',
            recipients=[email],
            body=f'Your OTP is {otp}. It is valid for 10 minutes.'
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False