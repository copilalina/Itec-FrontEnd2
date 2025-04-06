import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endPoints } from "../api/endpoints";
import "../CSS/LoginPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Parolele nu coincid!");
      return;
    }

    try {
      const response = await fetch(endPoints.RegisterUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Înregistrare reușită!");
        navigate("/login");  
      } else {
        const errorData = await response.json();
        let message = errorData.title || errorData.detail || "Registration failed.";

        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat();
          message = errors.join("\n");
        }
        alert("Error: " + message);
        console.error("Server response:", errorData);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Eroare de rețea. Încearcă din nou.");
    }
  };

  return (
    <div className="login-page">
      <div className="left-side">
        <h1 className="welcome-text">WELCOME!</h1>
      </div>
      <div className="right-side">
        <div className="login-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Retype Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
