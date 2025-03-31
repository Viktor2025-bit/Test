import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./Signup.css";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineAttachEmail } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added state for visibility
  const navigate = useNavigate();

  const backendURL = `https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/user/create`;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(backendURL, { name, email, password });
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      toast.success("Signup successful");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
      console.error("Signup error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <input
            className="name-input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <MdDriveFileRenameOutline size={20} color="black" className="name-icon" />
        </div>

        <div className="input-group">
          <input
            className="email-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <MdOutlineAttachEmail size={20} color="black" className="email-icon-1" />
        </div>

        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          {/* Eye icon toggle */}
          <span
            onClick={togglePasswordVisibility}
            className="password-toggle-icon"
            style={{ cursor: "pointer", position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)" }}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} color="black" className="eye-open"/>
            ) : (
              <AiOutlineEye size={20} color="black" className="eye-closed"/>
            )}
          </span>
        </div>

        <div className="button-container">
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Sign Up"}
          </button>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </form>
      <p className="account">
        Already have an account? <a href="/login" className="link">Login</a>
      </p>
    </div>
  );
};

export default Signup;