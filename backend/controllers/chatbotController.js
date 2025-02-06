const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");

// Mock AI logic for processing queries
exports.processQuery = (req, res) => {
  const { query } = req.body;

  // Load the document data
  const filePath = path.join(__dirname, "../uploads/data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Set up Fuse.js options
  const fuse = new Fuse(data, {
    keys: ["question"], // Search within the "question" field
    threshold: 0.4, // Adjust for sensitivity (lower = stricter, higher = more lenient)
  });

  // Perform fuzzy search
  const result = fuse.search(query);

  if (result.length > 0) {
    res.json({ answer: result[0].item.answer }); // Return the best match
  } else {
    res.json({ answer: "Sorry, I could not find an answer to your query." });
  }
};
