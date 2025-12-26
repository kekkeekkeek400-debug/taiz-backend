import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("Taiz backend is running 🚀");
});

app.post("/register", async (req, res) => {
  const { full_name, phone, city, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (full_name, phone, city, role) VALUES ($1,$2,$3,$4) RETURNING *",
      [full_name, phone, city, role]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* 🔥 هذا السطر هو سبب المشكلة الحقيقي */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
