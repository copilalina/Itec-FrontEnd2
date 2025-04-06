import { Routes, Route } from "react-router-dom";
import StartPage from "./components/startPage";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/registerPage";
import Dashboard from "./components/DashBoard";
import DashboardCreatedRooms from "./components/DeshboardCretedRooms"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/created-classes" element={<DashboardCreatedRooms />} /> 
    </Routes>
  );
}

export default App;
