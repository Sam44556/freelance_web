import express from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";

const router = express.Router();

// 🧾 POST a new job (for clients)
router.post("/create", async (req, res) => {
  try {
    const { title, description, budget, category, createdBy } = req.body;

    // Basic validation
    if (!title || !description || !budget || !category || !createdBy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify the user exists and is a client
    const user = await User.findById(createdBy);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "client")
      return res.status(403).json({ message: "Only clients can post jobs" });

    // Create job
    const newJob = new Job({
      title,
      description,
      budget,
      category,
      createdBy,
    });

    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔍 GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email role");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 APPLY to a job (for freelancers)
router.post("/apply/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "freelancer")
      return res.status(403).json({ message: "Only freelancers can apply" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.applicants.includes(userId))
      return res.status(400).json({ message: "Already applied" });

    job.applicants.push(userId);
    await job.save();

    res.json({ message: "Applied successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🗑️ DELETE job (only by creator)
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== userId)
      return res.status(403).json({ message: "Not authorized" });

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
