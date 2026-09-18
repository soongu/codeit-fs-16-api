// ~/instagram-api/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Post from './models/Post.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());

// 몽고디비 연결
await mongoose.connect(process.env.MONGO_URL);
console.log('데이터베이스에 연결됐어요.');

app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

// 전체 게시물 목록 서빙
app.get('/api/posts', async (req, res) => { 
  const posts = await Post.find();
  res.json(posts);
});

// 단일 게시물 서빙
app.get('/api/posts/:id', async (req, res) => {

  const post = await Post.findById(req.params.id);

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
  const { username, postImage } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 실제로 게시물을 추가해 줘야함.
  const newPost = await Post.create({
    ...req.body
  });

  res.status(201).json(newPost);
});

// 좋아요 수정요청
app.patch('/api/posts/:id', async (req, res) => {

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
  });

  if (!post) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }


  res.json(post);
});

// 게시물 삭제
app.delete('/api/posts/:id', async (req, res) => {
  
  const deleted = await Post.findByIdAndDelete(req.params.id);

  if (!deleted) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  res.json(deleted);
});


// 404 처리를 기본설정에서 커스텀설정으로 변경
app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.'
  });
});


app.use((err, req, res, next) => {

  if (err.name === 'CastError') {
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
