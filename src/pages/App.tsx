
import React from "react";
import type { FC } from 'react';
import { Link } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Full Stack PJ</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/otp">OTP Verification</Link></li>
          <li><Link to="/restaurants">Restaurants</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
