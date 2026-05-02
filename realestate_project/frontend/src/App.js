import React, { useEffect, useRef, useState } from "react";
import { getProperties, sendInquiry } from "./api";
import Login from "./Login";
import "./style.css";



function App() {
  // ---------- AUTH ----------
  const [loggedIn, setLoggedIn] = useState(false);

  // ---------- DATA ----------
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  // ---------- FORMS ----------
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [paymentDone, setPaymentDone] = useState(false);

  // ---------- SCROLL REFS ----------
  
  const formRef = useRef(null);

  // ---------- REVIEWS ----------
  const reviewsData = [
    { rating: "⭐⭐⭐⭐⭐", score: "4.8/5", count: 210, text: "Excellent location and smooth buying process." },
    { rating: "⭐⭐⭐⭐☆", score: "4.3/5", count: 145, text: "Good value for money and helpful agents." },
    { rating: "⭐⭐⭐⭐☆", score: "4.1/5", count: 98, text: "Peaceful area, suitable for families." },
    { rating: "⭐⭐⭐⭐⭐", score: "4.9/5", count: 320, text: "Premium property with great amenities." },
    { rating: "⭐⭐⭐⭐☆", score: "4.0/5", count: 76, text: "Ideal investment option." }
  ];

  // ---------- LOAD PROPERTIES ----------
  useEffect(() => {
    getProperties().then(setProperties);
  }, []);

  // ---------- OPEN INQUIRY ----------
  const openForm = (property) => {
    setSelected(property);
    setResult(null);
    setPaymentDone(false);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const validateForm = () => {

    let newErrors = {};
  
    // Name validation (only letters)
    const namePattern = /^[A-Za-z\s]+$/;
  
    if (!namePattern.test(form.name)) {
      newErrors.name = "Name must contain only letters";
    }
  
    // Phone validation (only numbers)
    const phonePattern = /^[0-9]{10}$/;
  
    if (!phonePattern.test(form.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
  
    // Email validation
    const emailPattern = /\S+@\S+\.\S+/;
  
    if (!emailPattern.test(form.email)) {
      newErrors.email = "Enter valid email address";
    }
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };

  // ---------- SUBMIT INQUIRY ----------
  const submitInquiry = async () => {

    if (!validateForm()) {
  return;
    }
    if (!form.name || !form.phone || !form.email) {
      alert("All fields are required");
      return;
    }
  
    if (form.phone.length !== 10) {
      alert("Phone number must be 10 digits");
      return;
    }
  
    const emailPattern = /\S+@\S+\.\S+/;
  
    if (!emailPattern.test(form.email)) {
      alert("Enter valid email");
      return;
    }
  
    try {
  
      const res = await sendInquiry({
        property_id: selected.id,
        ...form
      });
  
      alert("Inquiry submitted successfully");
  
      setResult(res);
  
    } catch {
      alert("Server error while sending inquiry");
    }
  
  };

  // ---------- PAYMENT ----------
  const submitPayment = () => {
    setPaymentDone(true);
  };

  // ---------- LOGIN CHECK ----------
  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <>

      {/* ================= NAVBAR ================= */}
<div className="navbar">
  <h2>Real Estate Properties</h2>

  <div className="nav-buttons">
  <a href="#home">Home</a>
  <a href="#properties">Properties</a>
  <a href="#support">Support</a>
  <a href="#logout">Logout</a>
</div>
</div>

      {/* ================= HERO ================= */}
      <div className="hero" id="home">
        <h1>Find Your Perfect Property</h1>
        <p>
          Explore verified bungalows and land listings,
          connect with trusted agents, and enquire securely.
        </p>
      </div>

      {/* ================= MAIN ================= */}
      <div className="container" id="properties">
        <div className="grid">
          {properties.map((p) => {
            const r = reviewsData[p.id % reviewsData.length];
            return (
              <div className="card" key={p.id}>
                <img
                  src={`http://127.0.0.1:5000${p.image}`}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />

                <h3>{p.title}</h3>
                <p>{p.location}</p>
                <strong>₹ {p.price}</strong>
                <p>{p.description}</p>

                <p style={{ fontSize: "13px", color: "#374151" }}>
                  📞 Support: AI Assistant & Verified Agents
                </p>

                <p style={{ fontSize: "14px" }}>
                  {r.rating} ({r.score}) – {r.count} reviews <br />
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>
                    “{r.text}”
                  </span>
                </p>

                <button onClick={() => openForm(p)}>
                  I am Interested
                </button>
              </div>
            );
          })}
        </div>

        {/* ================= INQUIRY FORM ================= */}
        {selected && !result && (
          <div ref={formRef} className="card" style={{ marginTop: 40 }}>
            <h3>Interested in:</h3>
            <p><b>{selected.title}</b> — {selected.location}</p>
           <input
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && <p style={{color:"red",fontSize:"13px"}}>{errors.name}</p>}
     <input
           placeholder="Phone Number"
           value={form.phone}
           onChange={e => setForm({ ...form, phone: e.target.value })}
     />
      {errors.phone && <p style={{color:"red",fontSize:"13px"}}>{errors.phone}</p>}
     <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
      />
      {errors.email && <p style={{color:"red",fontSize:"13px"}}>{errors.email}</p>}
            <button className="inquiry-btn" onClick={submitInquiry}>
             Submit Inquiry
            </button>
          </div>
        )}

        {/* ================= RESULT ================= */}
        {result && (
          <div className="card" style={{ marginTop: 40 }}>
            <h3>Inquiry Submitted Successfully ✅</h3>

            <h4>📞 Property Agents</h4>
            {result.agents.map((a, i) => (
              <p key={i}>
                <b>{a.name}</b><br />
                📱 {a.phone}<br />
                ✉️ {a.email}
              </p>
            ))}

            <hr />

            <h4>🏦 Platform Bank Details (Demo)</h4>
            <p>Account Name: {result.bank.account_name}</p>
            <p>Bank: {result.bank.bank}</p>
            <p>Account No: {result.bank.account_no}</p>
            <p>IFSC: {result.bank.ifsc}</p>
            <p>UPI: {result.bank.upi}</p>

            <hr />

            <h4>Scan QR to Pay (Demo)</h4>
            <img src="/qr.jpeg" alt="QR Code" style={{ width: 160 }} />

            <hr />

            
          
          </div>
        )}

  
        {/* ================= SUPPORT ================= */}
        <footer>
        <div className="card" id="support">
            <h3>📞 Customer Support</h3>
            <p>
              Our AI assistant and agents help users with property details,
              site visits, and secure inquiries.
            </p>
            <p>
              ✉️ support@realestates.com <br />
              📱 +91 9322904069 / 8956638920
            </p>
          </div>

          <p style={{ marginTop: 20 }}>
            © 2026 Real Estates | Designed by Snehal Sarvade & Ayushma Pawar
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;