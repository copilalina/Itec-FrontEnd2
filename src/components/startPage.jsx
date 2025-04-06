import { useNavigate } from "react-router-dom";
import "../CSS/startPage.css";
import smileIcon from "../assets/smile.png"; 

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-box" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={() => navigate("/login")} style={{ flex: 1, marginRight: 10 }}>Sign In</button>
            <button onClick={() => navigate("/register")} style={{ flex: 1 }}>Sign Up</button>
          </div>
          <img src={smileIcon} alt="smile" style={{ width: 60, margin: '20px auto' }} />
        </div>
        <p style={{ color: 'white', fontSize: 20, marginTop: 40, textAlign: 'center' }}>
          Gândește clar, învață rapid,<br />
          dă viață ideilor tale cu <strong>ThinkFlow</strong>.
        </p>
      </div>
    </div>
  );
}