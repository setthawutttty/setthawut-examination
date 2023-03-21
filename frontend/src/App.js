import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Edit from "./components/EditProfile";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const login = localStorage.getItem("login");
    console.log(login);
    if (parseInt(login) === 1) {
      navigate("/profile");
    }
  }, []);

  return (
    <Routes>
      <Route index path="/" element={<Login />} />
      <Route path="/regis" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
     
      <Route path="/edit" element={<Edit />} />
    </Routes>
  );
}

export default App;
