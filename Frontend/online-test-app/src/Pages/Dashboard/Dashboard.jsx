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
          fetch(`https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/user/stats?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/user/tests/active?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/user/results?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
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

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const autoSubmitTest = async () => {
    if (!activeTest) return;
    try {
      await fetch("https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/auto-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testId: activeTest.testId, userId }),
      });
      setActiveTest(null);
      setTimeLeft(null);
      toast.success("Test auto-submitted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to auto-submit test");
    }
  };

  const handleStartTest = async () => {
    try {
      const response = await fetch(
        `https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/questions?userId=${userId}&amount=${amount}&difficulty=${difficulty}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      toast.success("New test started");
      navigate(`/test?testId=${data._id}`);
    } catch (error) {
      toast.error("Failed to start test");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out");
    window.location.href = "/login";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  if (loading) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {userData.username}!</h1>
        <button onClick={handleLogout}>Logout</button>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
      </header>
      <section className="stats">
        <p>Last Score: {userData.lastScore}</p>
        <p>Tests Completed: {userData.testsCompleted}</p>
      </section>
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
      </section>
      {activeTest && (
        <section className="active-test">
          <h2>Active Test</h2>
          <p>Test ID: {activeTest.testId}</p>
          <p>Progress: {activeTest.answered}/{activeTest.totalQuestions}</p>
          <p>Time Left: {formatTime(timeLeft)}</p>
          <button onClick={() => (window.location.href = `/test?testId=${activeTest.testId}`)}>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
            Continue Test
          </button>
        </section>
      )}
      <section className="past-results">
        <h2>Past Results</h2>
        <table>
          <thead>
            <tr><th>Date</th><th>Score</th><th>Details</th></tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{new Date(result.submittedAt).toLocaleDateString()}</td>
                <td>{result.percentage}% ({result.score}/{result.totalQuestions})</td>
                <td><a href={`/result?id=${result._id}`}>View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;