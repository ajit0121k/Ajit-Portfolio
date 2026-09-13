import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function clean() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Delete dummy/test messages
    const dummyEmails = ['test@example.com', 'recruiter@topcompany.com', 'recruiting@google.com'];
    const res1 = await mongoose.connection.collection('messages').deleteMany({
      email: { $in: dummyEmails }
    });
    console.log('Deleted dummy recruiter/test messages:', res1.deletedCount);

    const res2 = await mongoose.connection.collection('messages').deleteMany({
      message: { $in: ['tydrdyd', 'rg', 'dryerh'] }
    });
    console.log('Deleted gibberish test messages:', res2.deletedCount);

    const remainingMessages = await mongoose.connection.collection('messages').countDocuments();
    console.log('Remaining real messages:', remainingMessages);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Error cleaning:', err);
    process.exit(1);
  }
}

clean();
