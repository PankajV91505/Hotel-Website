from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.room import Room
from flask_jwt_extended import jwt_required, get_jwt_identity

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([{
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'capacity': room.capacity,
        'available': room.available
    } for room in rooms]), 200

@rooms_bp.route('/', methods=['POST'])
@jwt_required()
def create_room():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    capacity = data.get('capacity')

    if not all([name, price, capacity]):
        return jsonify({'message': 'Missing required fields'}), 400

    room = Room(name=name, description=description, price=price, capacity=capacity, created_by=user_id)
    db.session.add(room)
    db.session.commit()
    return jsonify({'message': 'Room created', 'id': room.id}), 201

@rooms_bp.route('/<int:id>', methods=['GET'])
def get_room(id):
    room = Room.query.get_or_404(id)
    return jsonify({
        'id': room.id,
        'name': room.name,
        'description': room.description,
        'price': room.price,
        'capacity': room.capacity,
        'available': room.available
    }), 200

@rooms_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_room(id):
    user_id = get_jwt_identity()
    room = Room.query.get_or_404(id)
    if room.created_by != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    room.name = data.get('name', room.name)
    room.description = data.get('description', room.description)
    room.price = data.get('price', room.price)
    room.capacity = data.get('capacity', room.capacity)
    room.available = data.get('available', room.available)
    db.session.commit()
    return jsonify({'message': 'Room updated'}), 200

@rooms_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_room(id):
    user_id = get_jwt_identity()
    room = Room.query.get_or_404(id)
    if room.created_by != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(room)
    db.session.commit()
    return jsonify({'message': 'Room deleted'}), 200