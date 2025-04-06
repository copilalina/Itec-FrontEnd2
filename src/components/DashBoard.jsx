import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importă useNavigate
import { endPoints } from "../api/endpoints";
import "../CSS/dashBoardDesigne.css";

export default function Dashboard() {
  const navigate = useNavigate(); // Creează instanța de navigate pentru a schimba ruta
  const [classes, setClasses] = useState(null);
  const [creatorEmails, setCreatorEmails] = useState({});
  const [roomId, setRoomId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    fetch(endPoints.GetJoinedRoomsByUserId, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        setClasses(data);

        const emails = {};
        for (const room of data) {
          try {
            const res = await fetch(endPoints.GetUserDetails(room.creatorId), {
              headers: { Authorization: `Bearer ${token}` },
            });
            const user = await res.json();
            emails[room.creatorId] = user.email;
          } catch (err) {
            console.error("Eroare la aducerea emailului creatorului:", err);
            emails[room.creatorId] = "necunoscut";
          }
        }
        setCreatorEmails(emails);
      })
      .catch((err) => console.error("Eroare la camere:", err));
  }, []);

  const handleJoinRoom = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !roomId) {
      alert("Te rugăm să introduci un ID valid.");
      return;
    }

    try {
      const response = await fetch(endPoints.JoinRoom(roomId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Te-ai alăturat camerei cu succes!");
        setShowModal(false); // Închide fereastra modală
      } else {
        alert("Eroare la alăturarea camerei.");
      }
    } catch (err) {
      console.error("Eroare la alăturare:", err);
      alert("A apărut o eroare.");
    }
  };

  // Funcția de navigare la Created Classes
  const handleCreatedClassesClick = () => {
    navigate("/created-classes"); // Navighează către /created-classes
  };

  // Funcția de navigare la My Classes
  const handleMyClassesClick = () => {
    navigate("/dashboard"); // Navighează către /dashboard
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul>
          <li className="active" onClick={handleMyClassesClick}>My Classes</li> {/* Navighează la My Classes */}
          <li onClick={handleCreatedClassesClick}>Created Classes</li> {/* Navighează la Created Classes */}
          <li>Calendar</li>
        </ul>
      </div>

      <div className="content">
        <h2>Clasele tale:</h2>

        {classes && classes.length === 0 ? (
          <p>Nu ești înscris în nicio clasă.</p>
        ) : (
          <div className="class-grid">
            {classes &&
              classes.map((room, index) => (
                <div
                  key={room.id}
                  className={`class-card color-${(index % 6) + 1}`}
                >
                  <h3>{room.name}</h3>
                  <p>{room.description}</p>
                  <em>Creată de: {creatorEmails[room.creatorId] || "Necunoscut"}</em>
                </div>
              ))}
          </div>
        )}

        {/* Butonul de Join Room */}
        <button
          onClick={() => setShowModal(true)}
          className="join-room-button"
        >
          <span className="plus-sign">+</span>
        </button>

        {/* Fereastra modală pentru a adăuga ID-ul camerei */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Join Room</h3>
              <input
                type="text"
                placeholder="Introdu ID-ul camerei"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button onClick={handleJoinRoom}>Join</button>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
