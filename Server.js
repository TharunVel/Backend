const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/feedbackDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);
app.use(express.static(path.join(__dirname))); 

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend.html")); 
});
app.post("/api/feedback", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const fb = new Feedback({ rating, comment });
    await fb.save();
    res.json({ message: "✅ Feedback submitted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/api/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ timestamp: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
