import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, CircularProgress, Container } from "@mui/material";
import axios from "axios";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://animated-space-system-wr547gr7gx4vh97ww-7000.app.github.dev/api/test/start",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.questions && response.data.questions.length > 0) {
          setQuestions(response.data.questions);
        } else {
          setError("No questions available at the moment.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load questions.");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading)
    return (
      <Container style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container style={{ textAlign: "center", marginTop: "20px" }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <Container maxWidth="md" style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Online Test
      </Typography>
      {questions.map((q, index) => (
        <Card key={index} style={{ marginBottom: "15px" }}>
          <CardContent>
            <Typography variant="h6">
              {index + 1}. {q.questionText}
            </Typography>
            {q.options &&
              q.options.map((option, idx) => (
                <Button key={idx} variant="outlined" style={{ margin: "5px" }}>
                  {option}
                </Button>
              ))}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default TestPage;
