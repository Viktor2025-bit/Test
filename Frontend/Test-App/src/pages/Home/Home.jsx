import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" className="homepage-container">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          Welcome to the Online Test App
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Take tests, track your progress, and improve your skills!
        </Typography>
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
