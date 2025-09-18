from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Allow requests from frontend (React at localhost:5173)

@app.route('/')
def home():
    return jsonify({"message": "Smart Traffic Management API is running 🚦"})

@app.route('/traffic')
def traffic_data():
    # Simulate dynamic traffic congestion levels
    congestion_levels = ["Low", "Moderate", "High", "Severe"]
    data = {
        "junction_1": random.choice(congestion_levels),
        "junction_2": random.choice(congestion_levels),
        "junction_3": random.choice(congestion_levels),
        "junction_4": random.choice(congestion_levels)
    }
    return jsonify(data)

if __name__ == '__main__':
    print("Starting Flask server on http://127.0.0.1:5000 ...")
    app.run(debug=True)
