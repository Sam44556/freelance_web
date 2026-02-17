import mongoose from 'mongoose';
import User from './models/User.js';
import Profile from './models/Profile.js';

async function backfillFreelancerProfiles() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME'); // Change to your DB name/URI
  const freelancers = await User.find({ role: 'freelancer' });
  let created = 0;
  for (const user of freelancers) {
    const exists = await Profile.findOne({ user: user._id });
    if (!exists) {
      await Profile.create({
        user: user._id,
        title: '',
        bio: '',
        skills: [],
        hourlyRate: 0,
        location: '',
        avatar: ''
      });
      created++;
    }
  }
  console.log(`Backfill complete. Profiles created: ${created}`);
  await mongoose.disconnect();
}

backfillFreelancerProfiles().catch(console.error);
