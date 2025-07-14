from os import environ
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = environ.get('SECRET_KEY')
    JWT_SECRET_KEY = environ.get('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = environ.get('MAIL_SERVER')
    MAIL_PORT = environ.get('MAIL_PORT')
    MAIL_USERNAME = environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = environ.get('MAIL_PASSWORD')
    MAIL_USE_TLS = environ.get('MAIL_USE_TLS') == 'True'
    MAIL_USE_SSL = environ.get('MAIL_USE_SSL') == 'True'
    MAIL_DEFAULT_SENDER = environ.get('MAIL_DEFAULT_SENDER')