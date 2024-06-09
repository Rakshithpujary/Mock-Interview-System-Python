from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions
from functions.emotion_analysis import analyze_fun

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
    except Exception as e:
        return jsonify({'response': "Something went wrong"}), 400
        
    return jsonify({'response': response}), 200

@app.route('/analyze-emotions', methods=['POST'])
def analyze_emotions():
    try:
        data = request.get_json()
        frames = data['frames']
        # print("\n\n\n Here =========== ,", frames, "\n\n\n")
        response = analyze_fun(frames)
    except Exception as e:
        return jsonify({'response': "Something went wrong"}), 400
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)