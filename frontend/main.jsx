
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Signup from "./Signup";
import OtpVerification from "./OtpVerification";
import Restaurants from "./Restaurants";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/restaurants" element={<Restaurants />} />
    </Routes>
  </BrowserRouter>
);
