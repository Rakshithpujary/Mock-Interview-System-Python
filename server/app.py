from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions
from functions.emotion_analysis import analyze_fun
from functions.review_generation import gen_review
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Initialize the Generative AI model and chat session globally
gemini_api_key = 'AIzaSyDNzleXUCODSzS9X6OnGomEeOtJxn6nMnA'
genai.configure(api_key=gemini_api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")
@app.before_request
def before_request():
    g.model = model

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
            return jsonify({'job_role' : job_role, 'exp_level' : experience_lvl, 'qtns': response}), 200
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