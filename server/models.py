from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )


class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )

    job_role = db.Column(db.String(100))
    questions = db.Column(db.Text)
    answers = db.Column(db.Text)
    review = db.Column(db.Text)
    emotion = db.Column(db.String(50))
    suspicious_count = db.Column(db.Integer)
    
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )