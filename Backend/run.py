from app import create_app, db
from app.models.user import User
app = create_app()

with app.app_context():
    user = User.query.filter_by(email='admintest@example.com').first()
    if user:
        user.is_admin = True
        db.session.commit()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)