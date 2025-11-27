import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import Header from "../components/header";

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();   // ← BACK BUTTON SUPPORT

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await changePassword(oldPass, newPass);

    setMessage(result.message);

    if (result.success) {
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="change-password-container">
      {/* <Header/> */}
      <div className="wrapper">

      {/* 🔙 BACK BUTTON */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ⬅ Back
      </button>

      <div className="change-password-box">
        <h2>Change Password</h2>

        {message && <p className="msg">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
    </div>
  );
}
