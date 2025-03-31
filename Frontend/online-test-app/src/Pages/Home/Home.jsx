import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "../../Styles/global.css";
import Img1 from "../../assets/element5-digital-jCIMcOpFHig-unsplash.jpg";

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Example check

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${Img1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
          zIndex: 1,
        }}
      ></div>

      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#fff",
            fontWeight: "bold",
            textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
          }}
        >
          Welcome to the Ultimate Online Test Platform
        </h1>
        <p style={{ fontSize: "1.2rem", textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}>
          Test your knowledge with real-time quizzes and instant results.
        </p>
        <button
          onClick={handleGetStarted}
          className="cta-button"
          style={{
            backgroundColor: "#ff4b5c",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "5px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            transition: "0.3s",
          }}
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}


