import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";

export default function InstructionsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Test Instructions
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please read the following instructions carefully before starting the test:
        </Typography>
        <Typography variant="body1" paragraph>
          - The test consists of multiple-choice questions sourced from Open Trivia Database.
        </Typography>
        <Typography variant="body1" paragraph>
          - You will have **10 minutes** to complete the test. The timer will start once you begin.
        </Typography>
        <Typography variant="body1" paragraph>
          - The test is **automatically submitted** when the timer runs out, even if you haven’t finished answering.
        </Typography>
        <Typography variant="body1" paragraph>
          - Do not refresh or close the page during the test, as this may result in losing progress.
        </Typography>
        <Typography variant="body1" paragraph>
          - Navigate between questions using the **Next** and **Previous** buttons.
        </Typography>
        <Typography variant="body1" paragraph>
          - You can review your answers before submitting the test manually.
        </Typography>
        <Typography variant="body1" paragraph>
          - Ensure a stable internet connection to prevent disruptions during the test.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/test")}
          sx={{ mt: 3 }}
        >
          Start Test
        </Button>
      </Box>
    </Container>
  );
}
