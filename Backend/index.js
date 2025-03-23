require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("./Config/db");
const testRoutes = require("./Routes/testRoutes");
const authRoutes = require("./Routes/authRoutes");

const app = express();

// ✅ Proper CORS setup for Codespaces
const corsOptions = {
    origin: [
        "https://animated-space-system-wr547gr7gx4vh97ww-5173.app.github.dev", // Your frontend URL (update port if needed)
        "https://animated-space-system-wr547gr7gx4vh97ww-7000.app.github.dev"  // Your backend URL
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies (if needed)
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.use(express.json());

// ✅ API Routes
app.use("/api/test", testRoutes);
app.use("/api/user", authRoutes);

// ✅ Server Port
const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`Server is running on https://animated-space-system-wr547gr7gx4vh97ww-${port}.app.github.dev/`);
});
