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
  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.'
    });
    return;
  }

  res.json(post);
});

// 404 처리를 기본설정에서 커스텀설정으로 변경
app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.'
  });
});

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 기다리고 있어요.');
});
