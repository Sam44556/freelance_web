import express from 'express'
import Invitation from '../models/Invitation.js'
import Job from '../models/Job.js'
import User from '../models/User.js'

const router = express.Router()

// Create invitation (client -> freelancer)
// Body: { jobId, clientId, freelancerId, message }
router.post('/', async (req, res) => {
  try {
    const { jobId, clientId, freelancerId, message } = req.body
    if (!jobId || !clientId || !freelancerId) {
      return res.status(400).json({ ok: false, message: 'jobId, clientId, freelancerId are required' })
    }

    const job = await Job.findById(jobId).select('_id createdBy title')
    if (!job) return res.status(404).json({ ok: false, message: 'Job not found' })
    if (String(job.createdBy) !== String(clientId)) {
      return res.status(403).json({ ok: false, message: 'Only job owner can invite' })
    }

    const freelancer = await User.findById(freelancerId).select('_id role name email')
    if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(400).json({ ok: false, message: 'Invalid freelancer' })
    }
    if (String(freelancer._id) === String(clientId)) {
      return res.status(400).json({ ok: false, message: 'Cannot invite yourself' })
    }

    // Prevent duplicate pending invite for same job+freelancer
    const dup = await Invitation.findOne({ job: jobId, freelancer: freelancerId, status: 'pending' })
    if (dup) return res.status(409).json({ ok: false, message: 'Invite already pending for this freelancer' })

    const invite = await Invitation.create({
      job: jobId,
      client: clientId,
      freelancer: freelancerId,
      message
    })

    const populated = await invite.populate([
      { path: 'job', select: 'title' },
      { path: 'client', select: 'name email' },
      { path: 'freelancer', select: 'name email' }
    ])

    res.status(201).json({ ok: true, invitation: populated })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

// List invitations for a freelancer (inbox)
// Query: ?freelancerId=...
router.get('/me', async (req, res) => {
  try {
    const { freelancerId } = req.query
    if (!freelancerId) return res.status(400).json({ ok: false, message: 'freelancerId is required' })

    const list = await Invitation.find({ freelancer: freelancerId })
      .sort('-createdAt')
      .populate([
        { path: 'job', select: 'title' },
        { path: 'client', select: 'name email' },
        { path: 'freelancer', select: 'name email' }
      ])
    res.json({ ok: true, invitations: list })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

// List invitations sent by a client
// Query: ?clientId=...
router.get('/sent', async (req, res) => {
  try {
    const { clientId } = req.query
    if (!clientId) return res.status(400).json({ ok: false, message: 'clientId is required' })

    const list = await Invitation.find({ client: clientId })
      .sort('-createdAt')
      .populate([
        { path: 'job', select: 'title' },
        { path: 'client', select: 'name email' },
        { path: 'freelancer', select: 'name email' }
      ])
    res.json({ ok: true, invitations: list })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

// Freelancer responds to invitation (accept/reject)
// Body: { status, freelancerId }
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, freelancerId } = req.body
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ ok: false, message: 'Invalid status' })
    }
    if (!freelancerId) return res.status(400).json({ ok: false, message: 'freelancerId is required' })

    const invite = await Invitation.findById(req.params.id)
    if (!invite) return res.status(404).json({ ok: false, message: 'Invitation not found' })
    if (String(invite.freelancer) !== String(freelancerId)) {
      return res.status(403).json({ ok: false, message: 'Only the invited freelancer can respond' })
    }
    if (invite.status !== 'pending') {
      return res.status(400).json({ ok: false, message: `Invitation already ${invite.status}` })
    }

    invite.status = status
    await invite.save()

    const populated = await invite.populate([
      { path: 'job', select: 'title' },
      { path: 'client', select: 'name email' },
      { path: 'freelancer', select: 'name email' }
    ])
    res.json({ ok: true, invitation: populated })
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message })
  }
})

export default router