🌐 Hotel Booking Application

A modern, full-stack hotel booking platform inspired by OYO and MakeMyTrip, designed to provide a seamless user experience for booking rooms. The application features user authentication, room management, secure payments via Razorpay, and a responsive, blue-themed UI. Built with a React + Vite frontend and a Flask backend, it leverages PostgreSQL for data storage and supports Google OAuth for login.
Table of Contents

    ✨ Features

    🚀 Tech Stack

    📁 Project Structure

    ⚙️ Prerequisites

    🛠️ Setup Instructions

        Backend Setup

        Frontend Setup

        Database Setup

    ▶️ Running the Application

    🔌 API Endpoints

        Authentication API Endpoints

        Rooms API Endpoints

        Bookings API Endpoints

    🧪 Testing

    🐞 Debugging Common Issues

    🔑 Environment Variables

    📮 Postman Collection

    🤝 Contributing

    📄 License

✨ Features
🔐 User Authentication

    Sign up with email/password and OTP verification.

    Login via email/password or Google OAuth.

    Password reset using OTP sent via email.

    Profile updates (phone number, location).

    Secure logout with JWT token invalidation.

🏨 Room Management

    Browse rooms with search and filter options.

    Admin users can create, update, or delete rooms.

    Room details include price, type, AC/parking availability, and description.

🗓️ Booking System

    Book rooms with check-in/check-out dates, guest details, and government ID.

    Integrated Razorpay for secure payments (test mode).

    Booking confirmation email with masked government ID (e.g., A123456789 → AXXXXX6789).

    View booking history in /dashboard/bookings.

🎨 UI/UX

    Responsive, blue-themed design inspired by OYO/MakeMyTrip.

    Mobile-friendly sidebar and search bar.

    Toast notifications for user feedback using react-toastify.

    Map integration (if implemented) using react-leaflet.

🔒 Security

    JWT-based authentication for API endpoints.

    CORS configured for secure frontend-backend communication.

    Input validation and error handling.

    Government ID privacy through masking in emails.

🧪 Testing

    Backend unit tests for authentication, rooms, and bookings.

    Postman collection for API testing.

🚀 Tech Stack

Layer
	

Tech

Frontend
	

React 18 + Vite + Tailwind CSS

Backend
	

Flask 2.x

Database
	

PostgreSQL 15+

Auth
	

JWT (Flask-JWT-Extended)

OTP Email
	

Flask-Mail (SMTP)

OAuth
	

Flask-OAuthlib (Google)

Payments
	

Razorpay SDK

API Testing
	

Postman

DB Migrations
	

Flask-Migrate

Notifications
	

React Toastify

Mapping (Opt.)
	

React Leaflet
📁 Project Structure

```
hotel-booking-app/
├── backend/                  # Flask backend
│   ├── app/
│   │   ├── __init__.py       # Flask app initialization
│   │   ├── config.py         # Configuration settings
│   │   ├── extensions.py     # Flask extensions (DB, JWT, Mail, etc.)
│   │   ├── models/           # Database models
│   │   │   ├── user.py       # User model
│   │   │   ├── room.py       # Room model
│   │   │   └── booking.py    # Booking model
│   │   ├── routes/
│   │   │   ├── auth.py       # Authentication routes
│   │   │   ├── rooms.py      # Room CRUD routes
│   │   │   ├── bookings.py   # Booking routes
│   │   │   └── __init__.py
│   │   ├── utils/            # Utility functions
│   │   │   ├── email.py      # Email sending functions
│   │   │   ├── otp.py        # OTP generation/verification
│   │   │   └── validators.py # Input validators
│   │   ├── static/           # Static files
│   │   └── templates/        # Email templates
│   ├── migrations/           # Database migrations
│   ├── tests/                # Backend tests
│   │   ├── test_auth.py
│   │   ├── test_rooms.py
│   │   └── test_bookings.py
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables
│   └── run.py                # Application entry point
│
└── frontend/                 # React + Vite frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── api/              # API services
    │   │   ├── auth.js       # Auth API calls
    │   │   ├── rooms.js      # Room API calls
    │   │   └── bookings.js   # Booking API calls
    │   ├── assets/           # Images, fonts, etc.
    │   ├── components/       # Reusable components
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   └── AdminRoomForm.jsx
    │   │   ├── auth/
    │   │   │   ├── ForgotPasswordForm.jsx
    │   │   │   ├── LoginForm.jsx
    │   │   │   ├── OTPForm.jsx
    │   │   │   └── SignupForm.jsx
    │   │   ├── bookings/
    │   │   │   ├── BookingCard.jsx
    │   │   │   ├── BookingDetails.jsx
    │   │   │   ├── BookingForm.jsx
    │   │   │   └── BookingList.jsx
    │   │   ├── common/
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Header.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── rooms/
    │   │   │   ├── RoomCard.jsx
    │   │   │   ├── RoomDetails.jsx
    │   │   │   ├── RoomFilters.jsx
    │   │   │   └── RoomForm.jsx
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       ├── Input.jsx
    │   │       └── Modal.jsx
    │   ├── contexts/         # React contexts
    │   │   ├── AuthContext.jsx
    │   │   └── RoomContext.jsx
    │   ├── hooks/            # Custom hooks
    │   │   ├── useAuth.js
    │   │   └── useApi.js
    │   ├── layouts/          # Page layouts
    │   │   ├── MainLayout.jsx
    │   │   └── AuthLayout.jsx
    │   ├── pages/            # Main pages
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Signup.jsx
    │   │   │   ├── VerifyOtp.jsx
    │   │   │   └── ForgotPassword.jsx
    │   │   ├── dashboard/
    │   │   │   ├── Rooms.jsx       # Room listing with filters
    │   │   │   ├── AddRoom.jsx     # Add new room
    │   │   │   └── EditRoom.jsx    # Edit room
    │   │   ├── bookings/
    │   │   │   └── MyBookings.jsx
    │   │   ├── Callback.jsx        # OAuth callback
    │   │   ├── Profile.jsx         # User profile
    │   │   └── Home.jsx
    │   ├── router/           # Routing configuration
    │   │   └── AppRouter.jsx
    │   ├── store/            # State management (if using Redux)
    │   ├── styles/           # Global styles
    │   │   ├── index.css
    │   │   └── tailwind.css
    │   ├── utils/            # Utility functions
    │   │   ├── auth.js       # Auth helpers
    │   │   └── validators.js # Form validators
    │   ├── App.jsx           # Main App component
    │   └── main.jsx          # Entry point
    ├── .env/                 # Frontend environment variables
    ├── postman/              # Postman collection for API testing
    │   ├── HotelBooking.postman_collection.json
    │   └── HotelBooking.postman_environment.json
    ├── tailwind.config.js    # Tailwind configuration
    ├── vite.config.js        # Vite configuration
    └── package.json
```

⚙️ Prerequisites

Before you begin, ensure you have the following installed:

    Python 3.8+: Install from python.org.

    Node.js 18+ (with npm 8+): Install from nodejs.org.

    PostgreSQL: Install from postgresql.org or use a managed service.

    Razorpay Account: Sign up for a test account at razorpay.com to obtain test credentials.

    Google OAuth Credentials: Set up a new project and obtain credentials from the Google Cloud Console for Google login.

    Postman: Install Postman from postman.com for API testing.

🛠️ Setup Instructions

Follow these steps to get the application up and running on your local machine.
Backend Setup

    Navigate to the Backend Directory:

    cd hotel-booking-app/backend

    Create a Virtual Environment:

    python -m venv venv
    source venv/bin/activate # On Windows: venv\Scripts\activate

    Install Dependencies:

    pip install -r requirements.txt

    Example requirements.txt content:

    flask==2.3.3
    flask-sqlalchemy==3.2.2
    flask-migrate==4.0.0
    flask-jwt-extended==0.5.1
    flask-mail==0.9.1
    flask-cors==0.7.0
    flask-oauthlib==0.9.7
    psycopg2-binary==2.9.9
    python-dotenv==1.0.1
    pytest==7.4.3

    Configure Environment Variables:
    Create a .env file in the backend/ directory and add your secret keys and credentials:

    FLASK_SECRET_KEY=your-flask-secret-key
    DATABASE_URL=postgresql://postgres:your_password@localhost/hotel
    MAIL_USERNAME=your_email@gmail.com
    MAIL_PASSWORD=your_app_password
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    Note: For MAIL_PASSWORD, if you are using Gmail, you will likely need to generate an App Password from your Google Account settings, as regular passwords are not supported for third-party app access.

    Ensure app/config.py is set up to load these variables:

    import os
    from dotenv import load_dotenv

    load_dotenv()

    class Config:
        SECRET_KEY = os.getenv('FLASK_SECRET_KEY')
        SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:your_password@localhost/hotel')
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        MAIL_SERVER = 'smtp.gmail.com'
        MAIL_PORT = 587
        MAIL_USE_TLS = True
        MAIL_USERNAME = os.getenv('MAIL_USERNAME')
        MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
        GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
        GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')

    Initialize Database:

    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade

Frontend Setup

    Navigate to the Frontend Directory:

    cd hotel-booking-app/frontend

    Install Dependencies:

    npm install

    Example package.json dependencies:

    {
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.16.0",
        "axios": "^1.5.1",
        "react-toastify": "^9.1.3",
        "react-leaflet": "^4.2.1",
        "tailwindcss": "^3.3.3"
      },
      "devDependencies": {
        "@vitejs/plugin-react": "^4.1.0",
        "vite": "^4.4.9"
      }
    }

    Configure Environment Variables:
    Create a .env file in the frontend/ directory:

    VITE_API_URL=http://localhost:5000/api
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

    Verify Razorpay Integration:
    Ensure your public/index.html file includes the Razorpay checkout script:

    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

Database Setup

    Create the Database:
    Open your PostgreSQL client (e.g., psql) and create the database:

    psql -U postgres
    CREATE DATABASE hotel;
    \q

    Add Test Data (Optional but Recommended):
    Connect to your new database and execute the following SQL commands to set up a test admin user and a sample room:

    psql -U postgres -d hotel

    Then, execute:

    UPDATE users SET phone_number = '9876543210', location = 'Mumbai, India', is_admin = true, is_verified = true WHERE email = 'pankajv91505@gmail.com';
    INSERT INTO rooms (id, name, description, price, room_type, is_ac, has_parking, availability)
    VALUES (7, 'Premium Suite', 'Luxurious suite with sea view', 8000, 'Suite', true, true, true);

▶️ Running the Application
Start Backend

    Navigate to the Backend Directory:

    cd hotel-booking-app/backend

    Activate Virtual Environment:

    source venv/bin/activate # On Windows: venv\Scripts\activate

    Run the Flask Application:

    python run.py

    The backend will be accessible at http://localhost:5000.

Start Frontend

    Navigate to the Frontend Directory:

    cd hotel-booking-app/frontend

    Run the React Development Server:

    npm run dev

    The frontend will be accessible at http://localhost:5173.

🔌 API Endpoints

All API endpoints are prefixed with /api.
Authentication API Endpoints (/api/auth)

    POST /signup: Register a user with OTP verification.

        Request:

        {
          "firstName": "Pankaj",
          "lastName": "Verma",
          "email": "user@example.com",
          "password": "password123"
        }

        Response:

        {
          "message": "OTP sent to your email"
        }

    POST /verify-otp: Verify OTP to activate account.

        Request:

        {
          "email": "user@example.com",
          "otp": "123456"
        }

        Response:

        {
          "message": "OTP verified",
          "access_token": "jwt_token"
        }

    POST /login: Login with credentials.

        Request:

        {
          "email": "user@example.com",
          "password": "password123"
        }

        Response:

        {
          "message": "Login successful",
          "access_token": "jwt_token"
        }

    GET /google: Initiate Google OAuth login.

    GET /google/callback: Handle Google OAuth callback.

    POST /logout: Invalidate JWT token.

        Headers: Authorization: Bearer <token>

        Response:

        {
          "message": "Logged out successfully"
        }

    POST /forgot-password: Request password reset OTP.

        Request:

        {
          "email": "user@example.com"
        }

        Response:

        {
          "message": "OTP sent to your email"
        }

    POST /reset-password: Reset password using OTP.

        Request:

        {
          "email": "user@example.com",
          "otp": "123456",
          "new_password": "newpassword123"
        }

        Response:

        {
          "message": "Password reset successful"
        }

    GET /me: Fetch user details.

        Headers: Authorization: Bearer <token>

        Response:

        {
          "first_name": "Pankaj",
          "last_name": "Verma",
          "email": "user@example.com",
          "...": "..."
        }

    PUT /update-profile: Update user profile.

        Request:

        {
          "phone_number": "9876543210",
          "location": "Mumbai, India"
        }

        Response:

        {
          "message": "Profile updated successfully"
        }

Rooms API Endpoints (/api/rooms)

    GET /: List all available rooms.

    GET /:id: Get room details by ID.

        Example: /rooms/7

    POST /: Create a new room (admin only).

        Request:

        {
          "name": "Premium Suite",
          "description": "Luxurious suite",
          "price": 8000,
          "room_type": "Suite",
          "is_ac": true,
          "has_parking": true
        }

    PUT /:id: Update room (admin only).

    DELETE /:id: Delete room (admin only).

Bookings API Endpoints (/api/bookings)

    POST /: Create a booking.

        Request:

        {
          "room_id": 7,
          "start_date": "2025-07-25",
          "end_date": "2025-07-27",
          "guest_name": "Pankaj Verma",
          "government_id": "A123456789",
          "phone_number": "9876543210",
          "amount": 8000,
          "payment_id": "pay_abc123"
        }

        Response:

        {
          "message": "Booking created successfully"
        }

    GET /my-bookings: List user's bookings.

        Response:

        [
          {
            "id": 1,
            "room_name": "Premium Suite",
            "start_date": "2025-07-25",
            "...": "..."
          }
        ]

🧪 Testing

Follow these steps to test the application's core functionalities:

    Login:

        Visit http://localhost:5173/login.

        Use the test credentials (pankajv91505@gmail.com and your password) or log in with Google.

        Verify that you are redirected to /dashboard/profile.

        Check your browser's DevTools Network tab for a successful /api/auth/login request (200 OK).

    Book Room:

        Navigate to http://localhost:5173/dashboard/book-room/7 (assuming you added room with ID 7).

        Fill in the booking form with the following details:

            Check-in: 2025-07-25

            Check-out: 2025-07-27

            Guest Name: Pankaj Verma

            Government ID: A123456789

            Phone: 9876543210

        Click "Book Now" and complete the Razorpay payment using a test card (e.g., 4111 1111 1111 1111, any future expiry date, CVV 123).

        Verify that you are redirected to /dashboard/bookings and receive a booking confirmation email with the masked government ID (e.g., AXXXXX6789).

    Logout:

        Click "Logout" in the Header or Sidebar.

        Verify that you are redirected to /login and localStorage.getItem('token') is null in your DevTools console.

        Check the DevTools Network tab for a successful /api/auth/logout request (200 OK).

    Admin Features:

        Log in as an admin user (ensure is_admin = true for your test user in the database).

        Access /dashboard/add-room to add new rooms and /dashboard/rooms to manage existing rooms (edit/delete).

    Backend Tests:

        Navigate to the backend directory:

        cd hotel-booking-app/backend

        Run the tests:

        pytest tests/

🐞 Debugging Common Issues

Here are solutions for common problems you might encounter:

    CORS Errors (e.g., /api/auth/logout 404):

        Check Backend Logs:

        cat backend/app.log

        Look for "Handled OPTIONS request" or any related errors.

        Verify CORS Configuration: Ensure CORS is correctly configured in app/__init__.py:

        CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

        Test CORS Manually:

        curl -X OPTIONS http://localhost:5000/api/auth/logout -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type,Authorization" -v

    401 Unauthorized (e.g., /auth/me):

        Verify Token in Local Storage: Open your browser's DevTools console and check:

        localStorage.getItem('token')

        Decode JWT Token: If a token exists, try decoding it in a Python shell to check its validity and claims:

        from flask_jwt_extended import decode_token
        # Ensure you replace 'your-secret-key' with your actual FLASK_SECRET_KEY
        token = "your_token_from_localStorage"
        decode_token(token, 'your-secret-key')

    Booking Button Not Working:

        Check Frontend Component: Inspect BookingForm.jsx for the onSubmit handler.

        Razorpay Script: Verify that the Razorpay script is correctly included in public/index.html.

        Network Request: In DevTools, check the Network tab for the /api/bookings request after attempting to book. It should show a 201 Created status.

    Email Not Sending:

        Test Email Configuration: Run this Python script in your backend to test email sending:

        from flask_mail import Message, Mail
        from app import create_app
        app = create_app()
        mail = Mail(app)
        msg = Message('Test', sender=app.config['MAIL_USERNAME'], recipients=['test@example.com'])
        msg.body = 'Test email'
        mail.send(msg)

        Environment Variables: Double-check MAIL_USERNAME and MAIL_PASSWORD in your backend/.env file. Ensure MAIL_PASSWORD is an App Password if you're using Gmail.

    Database Errors:

        Verify Schema: Use psql to inspect your database schema:

        psql -U postgres -d hotel -c "\d users"
        psql -U postgres -d hotel -c "\d rooms"
        psql -U postgres -d hotel -c "\d bookings"

        Check Test Data: Confirm that test data exists as expected:

        psql -U postgres -d hotel -c "SELECT * FROM rooms WHERE id = 7;"

🔑 Environment Variables
Backend (backend/.env)

    FLASK_SECRET_KEY=your-secret-key

    DATABASE_URL=postgresql://postgres:your_password@localhost/hotel

    MAIL_USERNAME=your_email@gmail.com

    MAIL_PASSWORD=your_app_password

    GOOGLE_CLIENT_ID=your_google_client_id

    GOOGLE_CLIENT_SECRET=your_google_client_secret

Frontend (frontend/.env)

    VITE_API_URL=http://localhost:5000/api

    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

📮 Postman Collection

A Postman collection is provided for easy API testing:

    Import frontend/postman/HotelBooking.postman_collection.json and frontend/postman/HotelBooking.postman_environment.json into Postman.

    Set the environment variables (e.g., baseUrl, token) within Postman to match your local setup.

    You can then test various endpoints like /api/auth/login, /api/rooms, and /api/bookings.

🤝 Contributing

We welcome contributions to this project! To contribute:

    Fork the repository.

    Create a new feature branch:

    git checkout -b feature/your-feature

    Commit your changes with a descriptive message:

    git commit -m "Add your feature"

    Push your branch to your forked repository:

    git push origin feature/your-feature

    Open a pull request from your feature branch to the main repository.

📄 License

This project is licensed under the MIT License.