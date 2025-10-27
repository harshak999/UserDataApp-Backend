const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Oracle Backend Server 🚀");
});

async function insertUserData(name, relation) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO USER_RELATION (NAME, RELATION) VALUES (:name, :relation)`,
      [name, relation],
      { autoCommit: true }
    );
    console.log("✅ Data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

app.post("/submit", async (req, res) => {
  const { name, relation } = req.body;
  try {
    await insertUserData(name, relation);
    res.status(200).send("Data inserted successfully!");
  } catch (error) {
    res.status(500).send("Error inserting data into database.");
  }
});

// ✅ Use dynamic Render port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
