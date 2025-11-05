import mongoose from 'mongoose'

const { Schema } = mongoose

const InvitationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    freelancer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

// Prevent duplicate pending invites for the same job + freelancer
InvitationSchema.index(
  { job: 1, freelancer: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
)

export default mongoose.model('Invitation', InvitationSchema)