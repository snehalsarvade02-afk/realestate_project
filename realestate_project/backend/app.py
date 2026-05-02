from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection

app = Flask(__name__)
CORS(app)

# ---------------- TEST ROUTE ----------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Backend Running"
    })

# ---------------- SIGNUP ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    
    if not data["email"] or not data["password"]:
        return jsonify({"message": "Email and Password required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (data["name"], data["email"], data["password"])
        )
        conn.commit()

        return jsonify({"message": "User registered successfully"}), 200

    except:
        return jsonify({"message": "User already exists"}), 400

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data["email"] or not data["password"]:
        return jsonify({"message": "Email and Password required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    )

    user = cur.fetchone()

    if user:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
    
    
# ---------------- PROPERTIES ----------------
@app.route("/properties", methods=["GET"])
def properties():
    return jsonify([
        {
            "id": 1,
            "title": "Luxury Bungalow",
            "location": "Pune",
            "price": "1.2 Crore",
            "image": "/static/images/1.jpeg",
            "description": "Independent bungalow with garden and parking."
        },
        {
            "id": 2,
            "title": "Farm Land Plot",
            "location": "Nashik",
            "price": "45 Lakhs",
            "image": "/static/images/f.jpeg",
            "description": "Open land suitable for farmhouse or investment."
        },
        {
            "id": 3,
            "title": "Hill View Bungalow",
            "location": "Lonavala",
            "price": "2.5 Crore",
            "image": "/static/images/16.jpeg",
            "description": "Premium bungalow with hill view."
        },
        {
            "id": 4,
            "title": "Open Land",
            "location": "Satara",
            "price": "32 Lakhs",
            "image": "/static/images/d.jpeg",
            "description": "NA land suitable for investment."
        },
        {
            "id": 5,
            "title": "River Side Bungalow",
            "location": "Karjat",
            "price": "1.8 Crore",
            "image": "/static/images/13.jpeg",
            "description": "Bungalow with river-facing view."
        },
        {
            "id": 6,
            "title": "Highway Touch Land",
            "location": "Ahmednagar",
            "price": "55 Lakhs",
            "image": "/static/images/c.jpeg",
            "description": "Commercial land on highway."
        },
        {
            "id": 7,
            "title": "Forest View Bungalow",
            "location": "Igathpuri",
            "price": "2.1 Crore",
            "image": "/static/images/14.jpeg",
            "description": "Nature-surrounded premium bungalow."
        },
        {
            "id": 8,
            "title": "Agricultural Land",
            "location": "Sangli",
            "price": "28 Lakhs",
            "image": "/static/images/e.jpeg",
            "description": "Fertile agricultural land."
        },
        {
            "id": 9,
            "title": "Resort Style Bungalow",
            "location": "Alibaug",
            "price": "3.2 Crore",
            "image": "/static/images/12.jpeg",
            "description": "Luxury resort-style bungalow."
        },
        {
            "id": 10,
            "title": "Plot for Villa",
            "location": "Panvel",
            "price": "60 Lakhs",
            "image": "/static/images/a.jpeg",
            "description": "Perfect plot for villa construction."
        }
    ])

# ---------------- INQUIRY ----------------
@app.route("/inquiry", methods=["POST"])
def inquiry():
    data = request.get_json()

    # validation
    if not data.get("name") or not data.get("phone") or not data.get("email"):
        return jsonify({"message": "All fields are required"}), 400

    if len(data.get("phone")) != 10:
        return jsonify({"message": "Phone number must be 10 digits"}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO inquiries (property_id, name, phone, email) VALUES (?, ?, ?, ?)",
        (data["property_id"], data["name"], data["phone"], data["email"])
    )

    conn.commit()

    return jsonify({
        "status": "success",
        "agents": [
            {
                "name": "Snehal Sarvade",
                "phone": "9322904069",
                "email": "snehalsarvade02@gmail.com"
            },
            {
                "name": "Ayushma Pawar",
                "phone": "8956638920",
                "email": "ayushmapawar@gmail.com"
            }
        ],
        "bank": {
            "account_name": "Real Estate Pvt Ltd",
            "bank": "State Bank of India",
            "account_no": "XXXX-XXXX-1234",
            "ifsc": "SBIN0001234",
            "upi": "realestate@upi"
        }
    })

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    print("✅ Backend running on http://127.0.0.1:5000")
    app.run(port=5000, debug=True)