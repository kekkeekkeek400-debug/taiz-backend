import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// Railway automatically injects DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Taiz backend is running 🚀");
});

// Register user
app.post("/register", async (req, res) => {
  try {
    const { full_name, phone, city, role } = req.body;

    if (!full_name || !phone || !city || !role) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, phone, city, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [full_name, phone, city, role]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

// 🚨 THIS LINE FIXES 502 ERROR ON RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
