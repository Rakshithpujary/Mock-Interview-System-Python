from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/call-function', methods=['POST'])
def call_function():
    data = request.get_json()
    # Here, you can call your Python function
    result = my_python_function(data)
    return jsonify(result=result)

def my_python_function(data):
    # Your function logic here
    return f"Received data: {data}"

if __name__ == '__main__':
    app.run(debug=True)