import express from "express";
import Proposal from "../models/Proposal.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

const router = express.Router();

// 📨 Create Proposal (only freelancers)
router.post("/create", async (req, res) => {
  try {
    const { jobId, freelancerId, coverLetter, proposedPrice, deliveryTime } = req.body;

    if (!jobId || !freelancerId || !coverLetter || !proposedPrice || !deliveryTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(freelancerId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "freelancer")
      return res.status(403).json({ message: "Only freelancers can send proposals" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Proposal.findOne({ job: jobId, freelancer: freelancerId });
    if (existing) return res.status(400).json({ message: "Proposal already submitted" });

    const proposal = new Proposal({
      job: jobId,
      freelancer: freelancerId,
      coverLetter,
      proposedPrice,
      deliveryTime,
    });

    await proposal.save();
    res.status(201).json({ message: "Proposal sent successfully", proposal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📄 Get all proposals for a job (only job owner)
router.get("/job/:jobId", async (req, res) => {
  try {
    const { clientId } = req.query;
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.createdBy.toString() !== clientId)
      return res.status(403).json({ message: "Not authorized to view proposals" });

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate("freelancer", "name email");

    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👤 Get proposals by freelancer
// ...existing code...

// 👤 Get proposals by freelancer
router.get("/freelancer/:freelancerId", async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.params.freelancerId })
      .populate({
        path: "job",
        select: "title description createdBy",
        populate: { path: "createdBy", select: "name email phone" }
      })
      .populate({ path: "freelancer", select: "name email" })
      .lean()
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})


// ✅ Client updates proposal status (accept/reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: "Proposal not found" });

    proposal.status = status;
    await proposal.save();

    res.json({ message: `Proposal ${status}`, proposal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
