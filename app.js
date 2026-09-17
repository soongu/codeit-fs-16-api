// ~/instagram-api/app.js
import express from 'express';
import { posts } from './data/posts.js';

let nextId = 4;

const app = express();

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());

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

app.post('/api/posts', (req, res) => {

  // 입력값 검증 (validation)
  const { username, postImage } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 실제로 게시물을 추가해 줘야함.
  const newPost = {
    ...req.body,
    id: nextId,
    likeCount: 0,
    commentCount: 0,
    minutesAgo: 0,
  };

  nextId++;
  posts.push(newPost);

  res.status(201).json(newPost);
});

// 좋아요 수정요청
app.patch('/api/posts/:id', (req, res) => {

  const id = Number(req.params.id);
  const found = posts.find(p => p.id === id);

  if (!found) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  found.likeCount = req.body.likeCount;

  res.json(found);
});

// 게시물 삭제
app.delete('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const deleted = posts[index];
  posts.splice(index, 1);

  res.json(deleted);
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
