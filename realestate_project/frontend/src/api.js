const BASE_URL = "http://127.0.0.1:5000";

// ---------------- PROPERTIES ----------------
export async function getProperties() {
  try {
    const res = await fetch(`${BASE_URL}/properties`);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ---------------- CHATBOT ----------------
export async function sendChatMessage(message) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) throw new Error("Chat failed");
    return await res.json();
  } catch (err) {
    return { reply: "AI Assistant is offline." };
  }
}

// ---------------- INQUIRY ----------------
export async function sendInquiry(data) {
  try {
    const res = await fetch(`${BASE_URL}/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Inquiry failed");
    return await res.json();
  } catch (err) {
    return { error: "Inquiry service not available" };
  }
}
