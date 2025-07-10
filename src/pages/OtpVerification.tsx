
import React, { useState } from "react";
import type { FC } from 'react';

const OtpVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "OTP sent.");
    } catch (err) {
      setMessage("Error sending OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      setMessage(data.message || "OTP verified.");
    } catch (err) {
      setMessage("Error verifying OTP.");
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={sendOtp}>Send OTP</button>
      <br />
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={verifyOtp}>Verify OTP</button>
      <p>{message}</p>
    </div>
  );
}

export default OtpVerification;
