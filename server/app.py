from flask import Flask, jsonify, request, g
import google.generativeai as genai

app = Flask(__name__)

# Initialize the Generative AI model and chat session globally
gemini_api_key = 'AIzaSyB2DpQylxNaQLbwW0hkxSwTXi1M3OrOJyo'
genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

@app.before_request
def before_request():
    g.chat = chat

@app.route('/')
def index():
    return 'Generative AI Chat API'

@app.route('/ask', methods=['POST'])
def ask_question():
    question = request.json.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400

    response = g.chat.ask(question)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)