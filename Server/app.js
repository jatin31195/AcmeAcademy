import express from "express";
import cors from "cors";
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 


app.get("/", (req, res) => {
  res.send("ACME Academy Backend is running!");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
