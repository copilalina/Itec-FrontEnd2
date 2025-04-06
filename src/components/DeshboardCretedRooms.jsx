import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import { endPoints } from "../api/endpoints";
import "../CSS/dashboardCreatedRooms.css";

export default function Dashboard() {
  const navigate = useNavigate();  
  const [classes, setClasses] = useState(null);
  const [creatorEmails, setCreatorEmails] = useState({});
  const [roomId, setRoomId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    fetch(endPoints.GetCreatedRoomsByUserId, {
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
        setShowModal(false);  
      } else {
        alert("Eroare la alăturarea camerei.");
      }
    } catch (err) {
      console.error("Eroare la alăturare:", err);
      alert("A apărut o eroare.");
    }
  };

  const handleCreateRoom = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !newRoomName || !newRoomDescription) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }

    try {
      const response = await fetch(endPoints.CreateRoom, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRoomName,
          description: newRoomDescription,
        }),
      });

      if (response.ok) {
        alert("Camera a fost creată cu succes!");
        setNewRoomName("");
        setNewRoomDescription("");
         
        setClasses([...classes, { name: newRoomName, description: newRoomDescription }]);
      } else {
        alert("Eroare la crearea camerei.");
      }
    } catch (err) {
      console.error("Eroare la crearea camerei:", err);
      alert("A apărut o eroare.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(endPoints.DeleteRoom(roomId), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Camera a fost ștearsă cu succes!");
        setClasses(classes.filter((room) => room.id !== roomId));  
      } else {
        alert("Eroare la ștergerea camerei.");
      }
    } catch (err) {
      console.error("Eroare la ștergerea camerei:", err);
      alert("A apărut o eroare.");
    }
  };

   
  const handleCreatedClassesClick = () => {
    navigate("/created-classes");  
  };

   
  const handleMyClassesClick = () => {
    navigate("/dashboard");  
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul>
          <li className="active" onClick={handleMyClassesClick}>My Classes</li> 
          <li onClick={handleCreatedClassesClick}>Created Classes</li>  
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
                  <button onClick={() => handleDeleteRoom(room.id)}>-</button>
                </div>
              ))}
          </div>
        )}

        {/* Formularul pentru crearea unei camere */}
        <div className="create-room-form">
          <h3>Creează o cameră</h3>
          <input
            type="text"
            placeholder="Numele camerei"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <textarea
            placeholder="Descrierea camerei"
            value={newRoomDescription}
            onChange={(e) => setNewRoomDescription(e.target.value)}
          ></textarea>
          <button onClick={handleCreateRoom} className="create-room-button">Create Room</button>
        </div>

        {/* Modal pentru a adăuga ID-ul camerei */}
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
