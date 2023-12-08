"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint,current_app
from api.models import db, User,Book,Favorites,Category
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def addLogin():
    request_body = request.get_json(force=True, silent=True)

    if request_body is None:
        raise APIException("You must send information", status_code=404)

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
        "access_token": access_token,
        "User": user_data.serialize()
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
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)

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


@api.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def getUserById(user_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)

    user = User.query.get(user_id)
    
    if user is None:
        raise APIException("Users not found", status_code=404)
    
    response_body = {
        "msg": "ok",
        "User": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    }

    return jsonify(response_body), 200


@api.route('/user/<string:user_username>', methods=['GET'])
def getUserByUsername(user_username):
    user = User.query.filter_by(username=user_username).first()

    if user is None:
        raise APIException("User not found", status_code=404)

    response_body = {
        "msg": "ok",
        "User": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['POST'])
@jwt_required()
def addUser():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    request_body = request.get_json(force=True, silent=True)

    if request_body is None:
        raise APIException("You must send information", status_code=400)

    if "username" not in request_body or request_body["username"] == "":
        raise APIException("The username is required", status_code=404)

    if "first_name" not in request_body or request_body["first_name"] == "":
        raise APIException("The first name is required", status_code=404)

    if "last_name" not in request_body or request_body["last_name"] == "":
        raise APIException("The last name is required", status_code=404)

    if "password" not in request_body or request_body["password"] == "":
        raise APIException("The password is required", status_code=404)

    username_exist = User.query.filter_by(
        username=request_body['username']).first()

    if username_exist:
        raise APIException("The username already exist", status_code=400)

    pw_hash = current_app.bcrypt.generate_password_hash(
        request_body['password']).decode("utf-8")

    user = User(
        username=request_body['username'],
        first_name=request_body['first_name'],
        last_name=request_body['last_name'],
        phone=request_body['phone'],
        password=pw_hash,
    )
    user.save()

    response_body = {
        "msg": "ok",
        "User": user.serialize()
    }

    return jsonify(response_body), 200


@api.route('/user/<int:user_id>', methods=['PUT'])
def updateUser(user_id):
    
    user = User.query.get(user_id)
    request_body = request.get_json(force=True, silent=True)

    if user is None:
        raise APIException("User not found", status_code=404)
    

    if request_body is None:
        raise APIException("You must send information", status_code=404)

    if "first_name" in request_body:
        user.first_name = request_body['first_name']

    if "last_name" in request_body:
        user.last_name = request_body['last_name']

    if "password" in request_body:
        pw_hash = current_app.bcrypt.generate_password_hash(
            request_body['password']).decode("utf-8")
        user.password = pw_hash

    user.update()

    response_body = {
        "msg": "ok",
        "User": user.serialize()
    }

    return jsonify(response_body), 200


@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def deleteUser(user_id):
    current_user = get_jwt_identity()
    user_current = User.query.filter_by(username=current_user).first()
    
    user = User.query.get(user_id)
    admin = User.query.filter_by(role = "admin").first()

    user.delete()

    response_body = {
        "msg": "ok"
    }

    return jsonify(response_body)


# <----------------- Book ----------------------->


@api.route('/books', methods=['GET'])
@jwt_required()
def getBooks():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Book not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)

    book = Book.query.all()
    
    if book is None:
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

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)    
    
    book = Book.query.get(book_id)

    if book is None:
        raise APIException("Book not found", status_code=404)

    response_body = {
        "msg": "ok",
        "Book": {
            "id": book.id,
            "name": book.name,
            "description": book.description,
            "year": book.year,
            "author": book.author,
            "category": book.category,
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

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    request_body = request.get_json(force=True, silent=True)

    if "first_name" not in request_body or request_body["first_name"] == "":
        raise APIException("The first name is required", status_code=404)

    if "last_name" not in request_body or request_body["last_name"] == "":
        raise APIException("The last name is required")
    
    book_exist = Book.query.filter_by(
        first_name=request_body['first_name'], 
        last_name=request_body['last_name'], 
        
    )
    if book_exist:
        raise APIException("The book already exist", status_code=400)

    book = Book(
        description=request_body['description'],
        author=request_body['author'],
    )

    book.save()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200


@api.route('/book/<int:book_id>', methods=['PUT'])
@jwt_required()
def updateBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    request_body = request.get_json(force=True, silent=True)
    book = Book.query.get(book_id)

    if book is None:
        raise APIException("Book not found", status_code=404)

    if request_body is None:
        raise APIException("You must send information", status_code=400)

    if "description" in request_body:
        book.description = request_body['description']

    if "author" in request_body:
        book.author = request_body['author']


    book.update()

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

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    book = Book.query.get(book_id)

    if book is None:
        raise APIException("Book not found", status_code=400)

    book.delete()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200

# <----------------- Favorites ----------------------->


@api.route('/favorites', methods=['GET'])
@jwt_required()
def getFavorites():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("Users not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
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


@api.route('/favorites/<int:favorites_id>', methods=['GET'])
@jwt_required()
def getFavoritesById(favorites_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)
    
    favorites = Favorites.query.get(favorites_id)

    if favorites is None:
        raise APIException("Favorites not found", status_code=404)

    response_body = {
            "msg": "ok",
            "favorites": {
                "id": favorites.id,
                "book": favorites.book,
            }
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
        raise APIException("avorites not found", status_code=404)

    response_body = {
        "msg": "ok",
        "favorites": Favorites
    }
    return jsonify(response_body), 200

@api.route('/favorites/<int:favorites_id>', methods=['PUT'])
@jwt_required()
def updateFavorites(favorites_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)
    
    favorites = Favorites.query.get(favorites_id)

    if favorites is None:
        raise APIException("Favorites not found", status_code=404)

    favorites.update()

    response_body = {
        "msg": "ok",
        "favorites": favorites.serialize()
    }

    return jsonify(response_body), 200


@api.route('/favorites/<int:favorites_id>', methods=['DELETE'])
@jwt_required()
def deletefavorites(favorites_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    favorites = Favorites.query.get(favorites_id)

    if favorites is None:
        raise APIException("Favorites not found", status_code=404)

    favorites.delete()

    response_body = {
        "msg": "ok"
    }

    return jsonify(response_body), 200
