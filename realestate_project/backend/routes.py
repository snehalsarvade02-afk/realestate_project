from flask import Blueprint, request, jsonify
from database import get_db_connection

routes = Blueprint("routes", __name__)

# ------------------ PROPERTIES ------------------
@routes.route("/properties", methods=["GET"])
def get_properties():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM properties").fetchall()
    conn.close()

    return jsonify([dict(row) for row in rows]), 200


# ------------------ SIGNUP ------------------
@routes.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json(force=True)

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (data.get("name"), data.get("email"), data.get("password"))
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Signup successful"}), 200

    except Exception as e:
        print("❌ SIGNUP ERROR:", e)
        return jsonify({"message": "Email already exists"}), 400


# ------------------ LOGIN ------------------
@routes.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (data.get("email"), data.get("password"))
        ).fetchone()
        conn.close()

        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print("❌ LOGIN ERROR:", e)
        return jsonify({"message": "Login failed"}), 500


# ------------------ AI CHAT ------------------
@routes.route("/chat", methods=["POST"])
def chat():
    try:
        msg = request.get_json(force=True).get("message", "").lower()

        conn = get_db_connection()
        cur = conn.cursor()

        if "pune" in msg:
            cur.execute("SELECT COUNT(*) FROM properties WHERE location='Pune'")
            reply = f"There are {cur.fetchone()[0]} properties available in Pune."

        elif "mumbai" in msg:
            cur.execute("SELECT COUNT(*) FROM properties WHERE location='Mumbai'")
            reply = f"There are {cur.fetchone()[0]} properties available in Mumbai."

        elif "baramati" in msg:
            cur.execute("SELECT COUNT(*) FROM properties WHERE location='Baramati'")
            reply = f"There are {cur.fetchone()[0]} properties available in Baramati."

        else:
            reply = "I can help you with property availability and pricing."

        conn.close()
        return jsonify({"reply": reply}), 200

    except Exception as e:
        print("❌ CHAT ERROR:", e)
        return jsonify({"reply": "Something went wrong"}), 500


# ------------------ INQUIRY ------------------
@routes.route("/inquiry", methods=["POST"])
def add_inquiry():
    try:
        data = request.get_json(force=True)

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO inquiries (property_id, name, phone, email) VALUES (?, ?, ?, ?)",
            (
                data.get("property_id"),
                data.get("name"),
                data.get("phone"),
                data.get("email")
            )
        )
        conn.commit()
        conn.close()

        return jsonify({
            "message": "Inquiry submitted successfully",
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
        }), 200

    except Exception as e:
        print("❌ INQUIRY ERROR:", e)
        return jsonify({"message": "Inquiry failed"}), 500
