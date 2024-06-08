from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions

app = Flask(__name__)

# Initialize the Generative AI model and chat session globally
gemini_api_key = 'AIzaSyB2DpQylxNaQLbwW0hkxSwTXi1M3OrOJyo'
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@app.before_request
def before_request():
    g.chat = chat

@app.route('/get_questions', methods=['POST'])
def ask_question():
    context = request.json.get('context')
    response = generate_questions(context)

    if not isinstance(response, list):
        return jsonify({'response': response}), 400

    return jsonify({'response': response}), 200

if __name__ == '__main__':
    app.run(debug=True)