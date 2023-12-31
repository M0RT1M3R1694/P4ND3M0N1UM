from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
# import pytz


db = SQLAlchemy()


class User (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(250), nullable=False)
    role = db.Column(db.String(15), nullable=False)
    # favorites = db.relationship("Favorites", backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.first_name +" "+  self.last_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Book (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(80), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    author = db.Column(db.String(80), nullable=False)
    # categories = db.Column(db.String(80), nullable=False)
    favorites = db.relationship("Favorites", backref='book', lazy=True)
    # categories = db.relationship("Categories", backref='book', lazy=True)

    def __repr__(self):
        return f'<Book {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "year": self.year,
            "author": self.author,
            # "categories": self.categories
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Categories (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    id_book = db.Column(db.Integer, db.ForeignKey(Book.id))

    def __repr__(self):
        return f'<Categories {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "book": self.id_book
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Favorites (db.Model):
    id = db.Column(db.Integer, primary_key=(True))
    id_book = db.Column(db.Integer, db.ForeignKey(Book.id))
    id_user = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    user = db.relationship("User", backref='book', lazy=True)

    def __repr__(self):
        return f'<Favorites {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "book": self.book.serialize(),
            "user": self.user.serialize()
        }

    def save(self):

        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()