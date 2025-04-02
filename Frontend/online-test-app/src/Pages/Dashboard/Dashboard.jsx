import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState({ username: "", lastScore: "N/A", testsCompleted: 0 });
  const [activeTest, setActiveTest] = useState(null);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, activeRes, resultsRes] = await Promise.all([
          fetch(`http://localhost:7000/api/user/stats?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:7000/api/user/tests/active?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`http://localhost:7000/api/user/results?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const user = await userRes.json();
        setUserData(user);

        const active = await activeRes.json();
        if (active.testId) {
          setActiveTest(active);
          setTimeLeft(active.timeRemaining || 600);
        }

        const resultsData = await resultsRes.json();
        setResults(resultsData);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchData();
    else navigate("/login");
  }, [userId, token]);

  const handleStartTest = async () => {
    if (activeTest) {
      toast.info("You already have an active test!");
      navigate(`/test?testId=${activeTest.testId}`);
      return;
    }

    try {
      const response = await fetch(
        `https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/questions?userId=${userId}&amount=${amount}&difficulty=${difficulty}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to start test");

      const data = await response.json();
      if (!data.testId) throw new Error("Invalid test data received");

      toast.success("New test started");
      navigate(`/test?testId=${data.testId}`);
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error(error.message || "Failed to start test");
    }
  };

  if (loading) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {userData.username}!</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Logout</button>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
      </header>
      
      <section className="new-test">
        <h2>Start a New Test</h2>
        <div className="filters">
          <select value={amount} onChange={(e) => setAmount(e.target.value)} disabled={loading}>
            <option value="10">10 Questions</option>
            <option value="20">20 Questions</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} disabled={loading}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button onClick={handleStartTest} disabled={loading}>Start New Test</button>
      </section>

      {activeTest && (
        <section className="active-test">
          <h2>Active Test</h2>
          <p>Test ID: {activeTest.testId}</p>
          <button onClick={() => navigate(`/test?testId=${activeTest.testId}`)}>Continue Test</button>
        </section>
      )}
    </div>
  );
};

export default Dashboard;