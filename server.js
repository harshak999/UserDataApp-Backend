const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const oracledb = require("oracledb");
const path = require("path");
const dbConfig = require("./dbConfig");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Route for inserting user data into Oracle
app.post("/submit", async (req, res) => {
  const { name, relation } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO USER_RELATION (NAME, RELATION) VALUES (:name, :relation)`,
      [name, relation],
      { autoCommit: true }
    );
    await connection.close();
    res.status(200).send("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Error inserting data into Oracle DB.");
  }
});

// Default route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
