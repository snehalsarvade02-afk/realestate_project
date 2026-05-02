import React, { useState } from "react";

function Login({ onLogin }) {

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {

    // Name validation
    if (isSignup && form.name.trim() === "") {
      alert("Name is required");
      return;
    }

    // Email validation
    if (form.email.trim() === "") {
      alert("Email is required");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;

    if (!emailPattern.test(form.email)) {
      alert("Enter valid email address");
      return;
    }

    // Password validation
    if (form.password.trim() === "") {
      alert("Password is required");
      return;
    }

    if (form.password.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    const url = isSignup ? "signup" : "login";

    try {

      const res = await fetch(`http://127.0.0.1:5000/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      alert(data.message);

      if (res.ok) {
        onLogin();
      }

    } catch {
      alert("Backend server not responding");
    }

  };

  return (

    <div className="card" style={{ maxWidth: 400, margin: "80px auto" }}>

      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {isSignup && (
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      )}

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      {/* Password Field with Eye Icon */}
      <div style={{ position: "relative" }}>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "8px",
            cursor: "pointer"
          }}
        >
          👁
        </span>

      </div>

      <button className="login-btn" onClick={submit}>
         {isSignup ? "Create Account" : "Login"}
      </button>

      <p style={{ marginTop: 10 }}>
        {isSignup ? "Already have an account?" : "New user?"}

        <span
          style={{
            color: "#2563eb",
            cursor: "pointer",
            marginLeft: 6
          }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Login" : "Sign Up"}
        </span>

      </p>

    </div>

  );
}

export default Login;