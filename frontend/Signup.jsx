
import React, { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful!");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Error signing up");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={handleSignup}>Signup</button>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
