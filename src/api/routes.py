"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint,current_app
from api.models import db, User,Book,Favorites,Categories
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required
import json

api = Blueprint('api', __name__)

# <----------------- login ----------------------->
@api.route('/login', methods=['POST'])
def addlogin():
    request_body = request.get_json(force=True, silent=True)

    if "username" not in request_body or request_body["username"] == "":
        raise APIException("The username is required", status_code=404)

    if "password" not in request_body or request_body["password"] == "":
        raise APIException("The password is required", status_code=404)

    user_data = User.query.filter_by(username=request_body['username']).first()

    if user_data is None:
        raise APIException("The username is incorrect", status_code=404)

    if current_app.bcrypt.check_password_hash(user_data.password, request_body['password']) is False:
        raise APIException('The password is incorrect', 401)

    access_token = create_access_token(identity=request_body['username'])

    response_body = {
        "msg": "ok",
        "User": user_data.serialize(),
        "access_token": access_token
    }

    return jsonify(response_body), 200
# <----------------- sign up ----------------------->
@api.route("/signup", methods=["POST"])
def create_one_user():
    body = json.loads(request.data)
    new_user = User(
        username = body["username"],
        first_name = body["first_name"],
        last_name = body["last_name"],
        email = body["email"],
        password = body["password"],
        role = body["role"],
    )
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "user created succesfull"}), 200

# <----------------- logout ----------------------->
@api.route('/islogout', methods=['POST'])
def is_logout():
    request_body = request.get_json(force=True, silent=True)

    if "username" not in request_body or request_body["username"] == "":
        raise APIException("The username is required", status_code=404)

    if "password" not in request_body or request_body["password"] == "":
        raise APIException("The password is required", status_code=404)

    user_data = User.query.filter_by(username=request_body['username']).first()

    if user_data is None:
        raise APIException("The username is incorrect", status_code=404)

    if current_app.bcrypt.check_password_hash(user_data.password, request_body['password']) is False:
        raise APIException('The password is incorrect', 401)


    response_body = {
        "msg": "ok",
    }

    return jsonify(response_body), 200

# <----------------- User ----------------------->

@api.route('/isauth', methods=['GET'])
@jwt_required()
def is_auth():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)
     
    return jsonify(user.serialize()), 200

@api.route('/user', methods=['GET'])
@jwt_required()
def getUsers():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Users not found", status_code=404)

    users = User.query.all()
    
    if users is None:
        raise APIException("Users not found", status_code=404)

    users = list(map(lambda user: user.serialize(), users))
    sorted_users = sorted(users, key=lambda user: user['id'])

    response_body = {
        "msg": "ok",
        "Users": sorted_users
    }

    return jsonify(response_body), 200

# <----------------- Book ----------------------->


@api.route('/book', methods=['GET'])
@jwt_required()
def getBooks():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Book not found", status_code=404)
   
    books = Book.query.all()
    
    if books is None:
        raise APIException("Book not found", status_code=404)
    
    books = list(map(lambda book: book.serialize(), books))
    sorted_books = sorted(books, key=lambda book: book['id'])

    response_body = {
        "msg": "ok",
        "books": sorted_books
    }

    return jsonify(response_body), 200


@api.route('/book/<int:book_id>', methods=['GET'])
@jwt_required()
def getBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)   
    
    book = Book.query.get(book_id)

    if book is None:
        raise APIException("Book not found", status_code=404)

    response_body = {
        "msg": "ok",
        "Book": {
            "name": book.name,
            "description": book.description,
            "year": book.year,
            "author": book.author,
        },
    }

    return jsonify(response_body), 200


@api.route('/book', methods=['POST'])
@jwt_required()
def addBook():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)
    
    request_body = request.get_json(force=True, silent=True)
    
    book = Book(
        name=request_body['name'],
        description=request_body['description'],
        year=request_body['year'],
        author=request_body['author'],
    )

    book.save()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200

@api.route('/book/<int:book_id>', methods=['DELETE'])
@jwt_required()
def deleteBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)
    
    book = Book.query.get(book_id)

    if book is None:
        raise APIException("Book not found", status_code=400)

    book.delete()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200

@api.route('/test', methods=['GET'])
def test():
    return jsonify({"mensaje":"todo funciona bien"}), 200

# <----------------- Favorites ----------------------->

@api.route('/favorites', methods=['GET'])
@jwt_required()
def getFavorites():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("Users not found", status_code=404)
    
    favorites = Favorites.query.all()

    if favorites is None:
        raise APIException("Favorites not found")

    favorites_s = list(map(lambda favorites: favorites.serialize(), favorites))

    sorted_favorites_s = sorted(favorites_s, key=lambda favorites: favorites['id'])
    
    response_body = {
        "msg": "ok",
        "favorites_s": sorted_favorites_s
    }
    return jsonify(response_body), 200

@api.route('/favorites/book/<int:book_id>', methods=['GET'])
@jwt_required()
def getFavorites_sByBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Users not found", status_code=404)
        
    favorites = Favorites.query.filter_by(id_book=book_id)
    favorites_s = list(map(lambda favorites: favorites.serialize(), favorites))

    if favorites is None:
        raise APIException("Favorites not found", status_code=404)

    response_body = {
        "msg": "ok",
        "favorites": Favorites
    }
    return jsonify(response_body), 200

@api.route('/favorites/<int:favorites_id>', methods=['DELETE'])
@jwt_required()
def deletefavorites(favorites_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)

    if favorites_id is None:
        raise APIException("Favorites not found", status_code=404)

    favorites_id.delete()

    response_body = {
        "msg": "ok"
    }

    return jsonify(response_body), 200
