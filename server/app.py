from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions
# from functions.emotion_analysis import analyze_fun
from functions.review_generation import gen_review
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from models import db, User, Interview
import jwt, json
from datetime import datetime, timedelta


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mock_interview.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)

bcrypt = Bcrypt(app)
db.init_app(app)
with app.app_context():
    db.create_all()

load_dotenv()  # Loads the variables from the .env file
gemini_api_key = os.getenv('GEMINI_API_KEY3')
SECRET_KEY = os.getenv("SECRET_KEY")

# Initialize the Generative AI model and chat session globally
genai.configure(api_key=gemini_api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")
@app.before_request
def before_request():
    g.model = model

@app.route("/")
def home():
    return "Weclome to Mock-Interview-System/Server", 200

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"status": 404, "message": "Not Found"}), 404

@app.route('/api/signup', methods=['POST'])
def signup():

    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']
    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = bcrypt.generate_password_hash(
        password
    ).decode('utf-8')

    user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    })

@app.route('/api/login', methods=['POST'])
def login():

    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not bcrypt.check_password_hash(
        user.password,
        password
    ):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return jsonify({
        "token": token,
        "user_id": user.id,
        "name": user.name
    })

@app.route('/api/get-questions', methods=['POST'])
def ask_questions():
    try:
        data = request.get_json()
        job_role = data['job_role']
        experience_lvl = data['experience_lvl']
        response = generate_questions(job_role, experience_lvl)

        # if not list then error
        if not isinstance(response, list):
            return jsonify({'errorMsg': response}), 400
        else: # success
            return jsonify({'job_role' : job_role, 'exp_lvl' : experience_lvl, 'qtns': response}), 200
    except Exception as e:
        print(f"Error occurred while generating question: {e}")
        return jsonify({'errorMsg': "Something went wrong"}), 400


@app.route('/api/get-review', methods=['POST'])
def get_review():
    try:
        data = request.get_json()
        job_role = data['job_role']
        # experience_lvl = data['experience_lvl']
        qns = data['qns']
        ans = data['ans']
        emotion = data['emotion']
        suspiciousCount = data['suspiciousCount']

        # get review
        review = gen_review(job_role, qns, ans, emotion, suspiciousCount)

        return jsonify({'review': review})
    except Exception as e:
        print(f"Error occurred while generating review: {e}")
        return jsonify({'errorMsg': "Something went wrong"}), 400


@app.route('/api/save-interview', methods=['POST'])
def save_interview():

    try:
        data = request.get_json()

        interview = Interview(
            user_id=data['user_id'],
            job_role=data['job_role'],
            questions=json.dumps(data['questions']),
            answers=json.dumps(data['answers']),
            review=data['review'],
            emotion=data['emotion'],
            suspicious_count=data['suspicious_count']
        )

        db.session.add(interview)
        db.session.commit()

        return jsonify({
            "message": "Interview saved"
        })

    except Exception as e:
        print(e)
        return jsonify({
            "error": "Failed to save interview"
        }), 400

@app.route('/api/interviews/<int:user_id>')
def get_interviews(user_id):

    interviews = Interview.query.filter_by(
        user_id=user_id
    ).all()

    return jsonify([
        {
            "id": i.id,
            "job_role": i.job_role,
            "review": i.review,
            "emotion": i.emotion,
            "created_at": str(i.created_at)
        }
        for i in interviews
    ])

# Emotion analysis using backend, not used anymore
# @app.route('/api/analyze-emotions', methods=['POST'])
# def analyze_emotions():
#     try:
#         data = request.get_json()
#         frames = data['frames']
#         response = analyze_fun(frames)

#         return jsonify({'response': response})
#     except Exception as e:
#         print(f"Error occurred while generating emotion analysis data: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


# Not used anymore since emotion analysis done in front end itself
# @app.route('/api/get-review-old', methods=['POST'])
# def get_review_old():
#     try:
#         data = request.get_json()
#         job_role = data['job_role']
#         # experience_lvl = data['experience_lvl']
#         qns = data['qns']
#         ans = data['ans']
#         frames = data['frames']

#         # get emotion analysis
#         emotion = analyze_fun(frames)

#         # get review
#         review = gen_review(job_role,qns,ans,emotion)

#         return jsonify({'response': review})
#     except Exception as e:
#         print(f"Error occurred while generating review: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


if __name__ == '__main__':
    app.run(debug=True)