from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/traffic')
def traffic_data():
    data = {
        "junction_1": "High",
        "junction_2": "Moderate",
        "junction_3": "Low"
    }
    return jsonify(data)

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
