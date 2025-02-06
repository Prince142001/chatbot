const express = require("express");
const { processQuery } = require("../controllers/chatbotController");

const router = express.Router();

// Route for handling chat requests
router.post("/query", processQuery);

module.exports = router;
