import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  title: { type: String, trim: true },
  bio: { type: String, trim: true },
  skills: [{ type: String, trim: true }],
  hourlyRate: { type: Number },
  location: { type: String, trim: true },
  phone: { type: String, trim: true },
  website: { type: String, trim: true },
  avatar: { type: String, trim: true },
  available: { type: Boolean, default: true }
}, { timestamps: true })

// Simple text index for search
ProfileSchema.index({ title: 'text', bio: 'text', skills: 'text', location: 'text' })

export default mongoose.model('Profile', ProfileSchema)