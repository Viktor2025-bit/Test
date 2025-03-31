import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./Result.css"

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get("id");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/results?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const results = await response.json();
        const matchedResult = results.find((r) => r._id === resultId);
        if (matchedResult) setResult(matchedResult);
        else toast.error("Result not found");
      } catch (err) {
        toast.error("Failed to load result");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (resultId && userId && token) fetchResult();
    else window.location.href = "/login";
  }, [resultId, userId, token]);

  if (loading) return <div className="result-page">Loading...</div>;

  return (
    <div className="result-page">
      <header>
        <h1>Test Result</h1>
        <button onClick={() => (window.location.href = "/dashboard")}>Back to Dashboard</button>
      </header>
      {result && (
        <>
          <section className="summary">
            <h2>Summary</h2>
            <p>Score: {result.score}/{result.totalQuestions} ({result.percentage}%)</p>
            <p>Submitted: {new Date(result.submittedAt).toLocaleString()}</p>
          </section>
          <section className="details">
            <h2>Detailed Results</h2>
            <table>
              <thead>
                <tr><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Result</th></tr>
              </thead>
              <tbody>
                {result.detailedResults.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.question}</td>
                    <td>{detail.selectedAnswer || "Not answered"}</td>
                    <td>{detail.correctAnswer}</td>
                    <td className={detail.isCorrect ? "correct" : "incorrect"}>
                      {detail.isCorrect ? "Correct" : "Incorrect"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
};

export default ResultPage;