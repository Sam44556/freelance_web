import express from 'express'
import Profile from '../models/Profile.js'

import User from '../models/User.js'

const router = express.Router()

// List freelancer profiles with optional search
router.get('/', async (req, res) => {
  const { search } = req.query
  const match = {}
  const text = (search || '').trim()
  // Find only users with role freelancer
  const profiles = await Profile.find(match)
    .populate({ path: 'user', select: 'name email role', match: { role: 'freelancer' } })
    .sort('-updatedAt')
    .lean()

  // Drop profiles whose user isn't freelancer
  let results = profiles.filter(p => p.user)

  if (text) {
    const q = text.toLowerCase()
    results = results.filter(p => {
      const fields = [
        p.title, p.bio, (p.skills || []).join(' '), p.location,
        p.user?.name, p.user?.email
      ]
      return fields.some(v => String(v || '').toLowerCase().includes(q))
    })
  }

  res.json({ ok: true, profiles: results })
})

// Get my profile (freelancer)

// ...existing code...

// Get my profile (freelancer) — public via userId
router.get('/me',  async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ ok: false, message: 'userId is required' })
    const profile = await Profile.findOne({ user: userId }).lean()
    res.json({ ok: true, profile: profile || null })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

// Create/Update my profile (freelancer only) — public via userId
router.put('/me',  async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ ok: false, message: 'userId is required' })

    const me = await User.findById(userId).select('role')
    if (!me || me.role !== 'freelancer') {
      return res.status(403).json({ ok: false, message: 'Only freelancers can edit profile' })
    }

    const {
      title, bio, skills, hourlyRate, location, phone, website, avatar, available
    } = req.body || {}

    const skillsArr = Array.isArray(skills)
      ? skills
      : String(skills || '').split(',').map(s => s.trim()).filter(Boolean)

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: { user: userId, title, bio, skills: skillsArr, hourlyRate, location, phone, website, avatar, available } },
      { upsert: true, new: true }
    )
    res.json({ ok: true, profile })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

// ...existing code...
// Public: get profile by user id
router.get('/:userId', async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate({ path: 'user', select: 'name email role' })
  if (!profile || profile.user?.role !== 'freelancer') {
    return res.status(404).json({ ok: false, message: 'Profile not found' })
  }
  res.json({ ok: true, profile })
})

export default router