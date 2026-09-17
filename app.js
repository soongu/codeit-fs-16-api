// ~/instagram-api/app.js
import express from 'express';
import { posts } from './data/posts.js';

const app = express();

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

// 전체 게시물 목록 서빙
app.get('/api/posts', (req, res) => { 
  res.json(posts);
});

// 단일 게시물 서빙
app.get('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((one) => one.id === id);
  res.json(post);
});

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 기다리고 있어요.');
});
