
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./TestPage.css";

const TestPage = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) {
      toast.error("Test ID is missing! Redirecting...");
      navigate("/dashboard");
      return;
    }

    const fetchTest = async () => {
      try {
        const response = await fetch(`https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/${testId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!data || !data.questions) {
          toast.error("Invalid test data received.");
          return;
        }

        setTest(data);
        setTimeLeft(data.timeRemaining || 0);
      } catch (err) {
        toast.error("Failed to load test.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId, token]);

  if (loading) return <div className="test-page">Loading...</div>;
  if (!test) return <div className="test-page">Test data unavailable</div>;

  return (
    <div className="test-page">
      <header>
        <h1>Test #{testId}</h1>
        <div className="timer">Time Left: {timeLeft} seconds</div>
      </header>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default TestPage;