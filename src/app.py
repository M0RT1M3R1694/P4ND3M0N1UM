"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory,render_template
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User, Client, Job
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    JWTManager,
)
from flask import Flask
from flask_mail import Mail, Message
from flask import Flask, make_response
from datetime import datetime


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), "../public/"
)
app = Flask(__name__)
bcrypt = Bcrypt(app)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.environ.get("JWS_SECRET")
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url.replace(
        "postgres://", "postgresql://"
    )
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'dev.solutions.team23@gmail.com'
app.config['MAIL_PASSWORD'] = 'jfihzvwnbjmzgnkt'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
MIGRATE = Migrate(app, db, compare_type=True)

db.init_app(app)
# <----------------- NODEMAILER----------------------->
mail = Mail(app)

# Allow CORS requests to this API
CORS(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix="/api")


# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


# generate sitemap with all your endpoints
@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")


# any other endpoint will try to serve it like a static file
@app.route("/<path:path>", methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# <----------------- Login ----------------------->


@app.route('/login', methods=['POST'])
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

    if bcrypt.check_password_hash(user_data.password, request_body['password']) is False:
        raise APIException('The password is incorrect', 401)

    access_token = create_access_token(identity=request_body['username'])

    response_body = {
        "msg": "ok",
        "access_token": access_token,
        "User": user_data.serialize()
    }

    return jsonify(response_body), 200


# <----------------- User ----------------------->


@app.route('/user', methods=['GET'])
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


@app.route('/user/<int:user_id>', methods=['GET'])
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


@app.route('/user/<string:user_username>', methods=['GET'])
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


@app.route('/user', methods=['POST'])
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

    pw_hash = bcrypt.generate_password_hash(
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


@app.route('/user/<int:user_id>', methods=['PUT'])
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
        pw_hash = bcrypt.generate_password_hash(
            request_body['password']).decode("utf-8")
        user.password = pw_hash

    user.update()

    response_body = {
        "msg": "ok",
        "User": user.serialize()
    }

    return jsonify(response_body), 200


@app.route('/user/<int:user_id>', methods=['DELETE'])
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


@app.route('/books', methods=['GET'])
@jwt_required()
def getClients():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Book not found", status_code=404)
    
    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)

    book = Book.query.all()
    
    if book is None:
        raise APIException("Book not found", status_code=404)
    
    books = list(map(lambda book: book.serialize(), clients))
    sorted_books = sorted(books, key=lambda book: book['id'])

    response_body = {
        "msg": "ok",
        "books": sorted_books
    }

    return jsonify(response_body), 200


@app.route('/book/<int:book_id>', methods=['GET'])
@jwt_required()
def getBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)    
    
    client = Client.query.get(client_id)**

    if client is None:
        raise APIException("Client not found", status_code=404)

    response_body = {
        "msg": "ok",
        "Client": {
            "id": client.id,
            "first_name": client.first_name,
            "last_name": client.last_name,
        },
    }

    return jsonify(response_body), 200


@app.route('/book', methods=['POST'])
@jwt_required()
def addClient():
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
        

    if book_exist:
        raise APIException("The book already exist", status_code=400)

    book = Book(
        first_name=request_body['first_name'],
        last_name=request_body['last_name'],
    )

    book.save()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200


@app.route('/book/<int:book_id>', methods=['PUT'])
@jwt_required()
def updateBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("User not found", status_code=404)

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    request_body = request.get_json(force=True, silent=True)
    book = Book.query.get(client_id)

    if book is None:
        raise APIException("Client not found", status_code=404)

    if request_body is None:
        raise APIException("You must send information", status_code=400)

    if "first_name" in request_body:
        book.first_name = request_body['first_name']

    if "last_name" in request_body:
        book.last_name = request_body['last_name']


    book.update()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200


@app.route('/book/<int:book_id>', methods=['DELETE'])
@jwt_required()
def deleteBook(book_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)

    if user.role.value != "admin":
        raise APIException("Access denied", status_code=403)
    
    book = Book.query.get(client_id)

    if book is None:
        raise APIException("Client not found", status_code=400)

    book.delete()

    response_body = {
        "msg": "ok",
        "book": book.serialize()
    }

    return jsonify(response_body), 200

# <----------------- Favorites ----------------------->


@app.route('/favorites', methods=['GET'])
@jwt_required()
def getJobs():
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


@app.route('/favorites/<int:favorites_id>', methods=['GET'])
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
                "id": job.id,
                "code": job.code,
                "type": job.type.name,
                "brand": job.brand,
                "model": job.model,
                "serial_number": job.serial_number,
                "status": job.status.name,
                "issues": job.issues,
                "comments": job.comments,
                "time_stamp": job.time_stamp,
                "technical": job.technical.serialize(),
                "client": job.client.serialize()
            }
        }
    return jsonify(response_body), 200

@app.route('/favorites/book/<int:book_id>', methods=['GET'])
@jwt_required()
def getJobsByClient(client_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        raise APIException("Users not found", status_code=404)
        
    favorites = Favorite.query.filter_by(id_book=book_id)
    favorites_s = list(map(lambda favorites: favorites.serialize(), favorites))

    if favorites is None:
        raise APIException("favorites not found", status_code=404)

    response_body = {
        "msg": "ok",
        "Jobs": jobs
    }
    return jsonify(response_body), 200

@app.route('/favorites/<int:favorites_id>', methods=['PUT'])
@jwt_required()
def updateFavorites(favorites_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    
    if user is None:
        raise APIException("User not found", status_code=404)
    
    favorites = Favorites.query.get(favorites_id)

    if favorites is None:
        raise APIException("Job not found", status_code=404)

    favorites.update()

    response_body = {
        "msg": "ok",
        "favorites": favorites.serialize()
    }

    return jsonify(response_body), 200


@app.route('/favorites/<int:favorites_id>', methods=['DELETE'])
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