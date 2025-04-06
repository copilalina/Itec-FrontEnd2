import { useState } from "react";
import { endPoints } from "../api/endpoints";
import { useNavigate } from "react-router-dom";
import "../CSS/LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // pentru navigare

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(endPoints.LoginUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        // Salvează token-ul și userId-ul în localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userId", data.userId); // salvează userId pentru dashboard
        console.log("Token salvat:", data.accessToken);
        console.log("User ID salvat:", data.userId);

        // Navighează la pagina de dashboard
        navigate("/dashboard");
      } else {
        alert(data.error || "Email sau parolă incorectă.");
      }
    } catch (error) {
      console.error("Eroare la request:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="left-side">
        <h1 className="welcome-text">WELCOME<br />BACK!</h1>
      </div>
      <div className="right-side">
        <div className="login-box">
          <h2>Log In</h2>
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

            <button type="submit">Sign In</button>
          </form>
          <p className="switch-text">
            Nu ai cont? <span onClick={() => navigate("/register")} className="link">Creează unul</span>
          </p>
        </div>
      </div>
    </div>
  );
}
