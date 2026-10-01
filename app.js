// ~/instagram-api/app.js
import express from 'express';
import cors from 'cors';
import { prisma } from './db.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());


app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

// 전체 게시물 목록 서빙
app.get('/api/posts', async (req, res) => { 

  const posts = await prisma.post.findMany({
    where: { username: req.query.username },
    orderBy: { createdAt: 'desc' },
    take: Number(req.query.limit) || undefined
  }); // SELECT * FROM posts WHERE username = 'minji' ORDER BY created_at DESC LIMIT 2;
  res.json(posts);
});

// 단일 게시물 서빙
app.get('/api/posts/:id', async (req, res) => {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.'
    });
    return;
  }

  res.json(post);
});


app.post('/api/posts', async (req, res) => {

  // 입력값 검증 (validation)
  const { username, profileImage, postImage, postAlt, content } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 실제로 게시물을 추가해 줘야함.
  const newPost = await prisma.post.create({
    data: { username, profileImage, postImage, postAlt, content },
  });

  res.status(201).json(newPost);
});

// 좋아요 수정요청
app.patch('/api/posts/:id', async (req, res) => {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  const { username, profileImage, postImage, postAlt, content, likeCount } =
    req.body;

  /*
      UPDATE posts
      SET like_count = ?, content = ?, ...
      WHERE id = ?
  */
  const post = await prisma.post.update({
    where: { id },
    data: { username, profileImage, postImage, postAlt, content, likeCount },
  });


  res.json(post);
});

// 게시물 삭제
app.delete('/api/posts/:id', async (req, res) => {

  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }
  
  // DELETE FROM posts WHERE id = ? 
  const deleted = await prisma.post.delete({
    where: { id }
  });


  res.json(deleted);
});


// 404 처리를 기본설정에서 커스텀설정으로 변경
app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.'
  });
});


// 전역 예외처리 구간 
app.use((err, req, res, next) => {

  if (err.code === 'P2025') {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  if (err.status) {
    res.status(err.status).json({ message: '보낸 내용을 읽을 수 없어요' });
    return;
  }

  console.error(err);
  res.status(500).json({ message: '서버에서 문제가 생겼어요' });
});


app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 기다리고 있어요.`);
});
