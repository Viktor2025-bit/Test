import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./TestPage.css";

const TestPage = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/user/tests/active?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.testId === testId) {
          setTest(data);
          setTimeLeft(data.timeRemaining);
          const initialAnswers = {};
          data.questions.forEach((q, index) => {
            if (q.userAnswer) initialAnswers[index] = q.userAnswer;
          });
          setAnswers(initialAnswers);
        } else {
          toast.error("Test not found or not active");
        }
      } catch (err) {
        toast.error("Failed to load test");
        //console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (testId && userId && token) fetchTest();
    else window.location.href = "/login";
  }, [testId, userId, token]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const saveAnswer = async (index, answer) => {
    try {
      await fetch("https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/save-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ testId, questionIndex: index, userAnswer: answer, userId }),
      });
      setAnswers((prev) => ({ ...prev, [index]: answer }));
      toast.success("Answer saved");
    } catch (error) {
      toast.error("Failed to save answer");
    }
  };

  const handleAnswerChange = (answer) => saveAnswer(currentQuestionIndex, answer);

  const submitTest = async () => {
    try {
      const answersArray = test.questions.map((q, index) => ({
        question: q.text,
        selectedAnswer: answers[index] || null,
        correctAnswer: q.correctAnswer,
      }));
      await fetch("https://special-space-umbrella-q74xqp7qpx4jhrpv-7000.app.github.dev/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, answers: answersArray }),
      });
      toast.success("Test submitted successfully");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Failed to submit test");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  if (loading) return <div className="test-page">Loading...</div>;

  const currentQuestion = test?.questions[currentQuestionIndex];

  return (
    <div className="test-page">
      <header>
        <h1>Test #{testId}</h1>
        <div className="timer">Time Left: {formatTime(timeLeft)}</div>
      </header>
      {test && (
        <>
          <section className="progress">
            <p>
              Question {currentQuestionIndex + 1} of {test.totalQuestions} | Answered:{" "}
              {Object.keys(answers).length}/{test.totalQuestions}
            </p>
            <div className="progress-bar">
              {test.questions.map((_, index) => (
                <span
                  key={index}
                  className={`progress-dot ${answers[index] ? "answered" : ""} ${
                    index === currentQuestionIndex ? "current" : ""
                  }`}
                />
              ))}
            </div>
          </section>
          <section className="question">
            <h2>{currentQuestion.text}</h2>
            <div className="options">
              {currentQuestion.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerChange(option)}
                    disabled={loading}
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>
          <section className="navigation">
            <button
              disabled={currentQuestionIndex === 0 || loading}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </button>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
            <button
              disabled={currentQuestionIndex === test.questions.length - 1 || loading}
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next
            </button>
            <button onClick={submitTest} disabled={loading}>Submit Test</button>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar/>
          </section>
        </>
      )}
    </div>
  );
};

export default TestPage;