// ~/instagram-api/seed.js
import mongoose from 'mongoose';
import Story from './Story.js';

const stories = [
  { username: 'jaehoon' },
  { username: 'minji' },
  { username: 'seungwoo' }
];

await mongoose.connect(process.env.MONGO_URL);

await Story.deleteMany({});
await Story.insertMany(stories);

console.log(`스토리 ${stories.length}개를 넣었어요.`);

await mongoose.disconnect();
