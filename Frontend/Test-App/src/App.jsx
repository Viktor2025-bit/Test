import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Instructions from "./pages/Instructions/Instructions";
import Dashboard from "./pages/Dashboard/Dashboard";
import TestPage from "./pages/TestPage/TestPage";
import axios from "axios";

// 🔹 Set API base URL dynamically (use Codespace URL when deployed)
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "https://animated-space-system-wr547gr7gx4vh97ww-7000.app.github.dev";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instruction" element={<Instructions />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
