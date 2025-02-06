const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

app.use(cors());
app.use(express.json());

// Add your routes here
app.get("/", (req, res) => {
  res.send("Chatbot API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
