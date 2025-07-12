from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data
MOCK_USER = {
    "id": 1,
    "username": "barterer1",
    "email": "barterer1@example.com",
    "first_name": "Alex",
    "last_name": "Smith",
    "location": "Bartertown",
    "availability": "Evenings",
    "profile_photo": None,
    "is_public": True,
    "rating": 4.8,
    "bio": "I love exchanging services and skills!",
    "date_joined": "2024-01-01T00:00:00Z",
    "offered_skills": [
        {"id": 1, "name": "Logo Design"},
        {"id": 2, "name": "Guitar Lessons"}
    ],
    "wanted_skills": [
        {"id": 3, "name": "Plumbing Repair"},
        {"id": 4, "name": "Dog Walking"}
    ],
    "skill_count": 4,
}

MOCK_SKILLS = [
    {"id": 1, "name": "Logo Design"},
    {"id": 2, "name": "Guitar Lessons"},
    {"id": 3, "name": "Plumbing Repair"},
    {"id": 4, "name": "Dog Walking"},
    {"id": 5, "name": "Baking"},
    {"id": 6, "name": "Car Wash"},
]

MOCK_USER_SKILLS = [
    {"id": 1, "skill": MOCK_SKILLS[0], "skill_id": 1, "is_offered": True},
    {"id": 2, "skill": MOCK_SKILLS[2], "skill_id": 3, "is_offered": False},
]

MOCK_SWAP_REQUESTS = [
    {
        "id": 1,
        "sender": MOCK_USER,
        "receiver": {**MOCK_USER, "id": 2, "username": "barterer2", "email": "barterer2@example.com", "first_name": "Jamie", "offered_skills": [{"id": 3, "name": "Plumbing Repair"}], "wanted_skills": [{"id": 1, "name": "Logo Design"}]},
        "sender_skill": MOCK_SKILLS[0],
        "receiver_skill": MOCK_SKILLS[2],
        "sender_skill_id": 1,
        "receiver_skill_id": 3,
        "message": "I'll design your logo if you fix my sink!",
        "status": "pending",
        "created_at": "2024-01-01T12:00:00Z",
    },
    {
        "id": 2,
        "sender": {**MOCK_USER, "id": 2, "username": "barterer2", "email": "barterer2@example.com", "first_name": "Jamie", "offered_skills": [{"id": 3, "name": "Plumbing Repair"}], "wanted_skills": [{"id": 1, "name": "Logo Design"}]},
        "receiver": MOCK_USER,
        "sender_skill": MOCK_SKILLS[2],
        "receiver_skill": MOCK_SKILLS[0],
        "sender_skill_id": 3,
        "receiver_skill_id": 1,
        "message": "I'll fix your sink if you design my logo!",
        "status": "accepted",
        "created_at": "2024-01-02T15:30:00Z",
    },
]

@app.route('/api/users/profile/', methods=['GET', 'PUT'])
def user_profile():
    if request.method == 'GET':
        return jsonify(MOCK_USER)
    if request.method == 'PUT':
        data = request.json or {}
        updated = {**MOCK_USER, **data}
        return jsonify(updated)

@app.route('/api/users/', methods=['GET'])
def users():
    user2 = {**MOCK_USER, "id": 2, "username": "barterer2", "email": "barterer2@example.com", "first_name": "Jamie", "offered_skills": [{"id": 3, "name": "Plumbing Repair"}], "wanted_skills": [{"id": 1, "name": "Logo Design"}]}
    return jsonify([MOCK_USER, user2])

@app.route('/api/users/<int:user_id>/', methods=['GET'])
def user_detail(user_id):
    return jsonify(MOCK_USER)

@app.route('/api/skills/', methods=['GET', 'POST'])
def skills():
    if request.method == 'GET':
        return jsonify(MOCK_SKILLS)
    if request.method == 'POST':
        data = request.json or {}
        new_skill = {"id": len(MOCK_SKILLS) + 1, "name": data.get("name", "New Skill")}
        return jsonify(new_skill)

@app.route('/api/skills/<int:skill_id>/', methods=['GET'])
def skill_detail(skill_id):
    skill = next((s for s in MOCK_SKILLS if s["id"] == skill_id), MOCK_SKILLS[0])
    return jsonify(skill)

@app.route('/api/user-skills/', methods=['GET', 'POST'])
def user_skills():
    if request.method == 'GET':
        return jsonify(MOCK_USER_SKILLS)
    if request.method == 'POST':
        data = request.json or {}
        new_skill = {"id": len(MOCK_USER_SKILLS) + 1, "skill": next((s for s in MOCK_SKILLS if s["id"] == data.get("skill_id")), MOCK_SKILLS[0]), "skill_id": data.get("skill_id"), "is_offered": data.get("is_offered", True)}
        return jsonify(new_skill)

@app.route('/api/user-skills/<int:skill_id>/', methods=['PUT', 'DELETE'])
def user_skill_detail(skill_id):
    if request.method == 'PUT':
        data = request.json or {}
        updated = {**MOCK_USER_SKILLS[0], **data}
        return jsonify(updated)
    if request.method == 'DELETE':
        return '', 204

@app.route('/api/swap-requests/', methods=['GET', 'POST'])
def swap_requests():
    if request.method == 'GET':
        return jsonify(MOCK_SWAP_REQUESTS)
    if request.method == 'POST':
        data = request.json or {}
        new_swap = {**MOCK_SWAP_REQUESTS[0], **data, "id": len(MOCK_SWAP_REQUESTS) + 1}
        return jsonify(new_swap)

@app.route('/api/swap-requests/<int:swap_id>/', methods=['GET', 'PUT'])
def swap_request_detail(swap_id):
    if request.method == 'GET':
        return jsonify(MOCK_SWAP_REQUESTS[0])
    if request.method == 'PUT':
        data = request.json or {}
        updated = {**MOCK_SWAP_REQUESTS[0], **data}
        return jsonify(updated)

@app.route('/api/auth/login/', methods=['POST'])
def login():
    return jsonify({"user": MOCK_USER, "message": "Login successful"})

@app.route('/api/auth/register/', methods=['POST'])
def register():
    return jsonify({"user": MOCK_USER, "message": "Registration successful"})

@app.route('/api/auth/logout/', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful"})

@app.route('/api/health/', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Mock health check", "timestamp": "2024-01-01T00:00:00Z"})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 