import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/users/register
router.post("/register", async (req, res) => {
	try {
		const { name, email, password, role } = req.body;

		if (!name || !email || !password || !role) {
			return res.status(400).json({ message: "name, email, password and role are required" });
		}

		const allowedRoles = ["client", "freelancer"];
		if (!allowedRoles.includes(role)) {
			return res.status(400).json({ message: "role must be 'client' or 'freelancer'" });
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashed,
			role,
			provider: "credentials",
		});

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET || "dev_secret",
			{ expiresIn: "7d" }
		);

		return res.status(201).json({
			message: "Registered successfully",
			user: { _id: user._id, name: user.name, email: user.email, role: user.role, provider: user.provider },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
});

// POST /api/users/login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		if (user.provider !== "credentials") {
			return res.status(400).json({ message: "Use your social login for this account" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ id: user._id, role: user.role },
			process.env.JWT_SECRET || "dev_secret",
			{ expiresIn: "7d" }
		);

		return res.json({
			message: "Logged in successfully",
			user: { _id: user._id, name: user.name, email: user.email, role: user.role, provider: user.provider },
			token,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
});

// GET /api/users/me (optional helper)
router.get("/me", async (req, res) => {
	try {
		const auth = req.headers.authorization || "";
		const [, token] = auth.split(" ");
		if (!token) return res.status(401).json({ message: "Missing token" });

		const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
		const user = await User.findById(payload.id).select("name email role provider");
		if (!user) return res.status(404).json({ message: "User not found" });
		return res.json({ user });
	} catch (err) {
		return res.status(401).json({ message: "Invalid or expired token" });
	}
});

export default router;
