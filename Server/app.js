import express from "express";
import cors from "cors";
const app = express();
import authRoute from './src/routes/authRoute.js';
// Middleware
app.use(cors({
  origin: 'https://54c618dfa4a8.ngrok-free.app', // allow only this frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); 
app.use(express.json());
app.use("/api/users", authRoute);

app.get("/", (req, res) => {
  res.send("ACME Academy Backend is running!");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
