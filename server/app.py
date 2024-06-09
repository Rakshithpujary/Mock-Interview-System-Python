from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions
from functions.emotion_analysis import analyze_fun
from functions.review_generation import gen_review

from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Initialize the Generative AI model and chat session globally
gemini_api_key = 'AIzaSyB2DpQylxNaQLbwW0hkxSwTXi1M3OrOJyo'
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@app.before_request
def before_request():
    g.chat = chat

@app.route('/get-questions', methods=['POST'])
def ask_questions():
    try:
        job_title = request.json.get('job_title')
        response = generate_questions(job_title)

        # if not list then error
        if not isinstance(response, list):
            return jsonify({'response': response}), 400
        else: # success
            return jsonify({'response': response}), 200
    except Exception as e:
        print(f"Error occurred while generating question: {e}")
        return jsonify({'response': "Something went wrong"}), 400

@app.route('/analyze-emotions', methods=['POST'])
def analyze_emotions():
    try:
        data = request.get_json()
        frames = data['frames']
        response = analyze_fun(frames)

        return jsonify({'response': response})
    except Exception as e:
        print(f"Error occurred while generating emotion analysis data: {e}")
        return jsonify({'response': "Something went wrong"}), 400

@app.route('/get-review', methods=['POST'])
def get_review():
    try:
        data = request.get_json()
        job_role = data['job_role']
        qns = data['qns']
        ans = data['ans']
        frames = data['frames']

        # get emotion analysis
        emotion = analyze_fun(frames)
        review = gen_review(job_role,qns,ans,emotion)

        return jsonify({'response': review})
    except Exception as e:
        print(f"Error occurred while generating review: {e}")
        return jsonify({'response': "Something went wrong"}), 400

if __name__ == '__main__':
    app.run(debug=True)