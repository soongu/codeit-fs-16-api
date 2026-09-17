// ~/instagram-api/seed.js
import mongoose from 'mongoose';
import Post from './models/Post.js';
import { posts } from './data/posts.js';

const MONGO_URL =
  '';

await mongoose.connect(MONGO_URL);

await Post.deleteMany({});
await Post.insertMany(posts);

console.log(`게시물${posts.length}개를 넣었어요.`);

await mongoose.disconnect();
