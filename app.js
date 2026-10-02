// ~/instagram-api/app.js
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import { HttpError } from './errors.js';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(cors());

// 모든 요청 초입에 작동해서 클라이언트가 보낸 json을 재조립
app.use(express.json());


app.get('/', (req, res) => {
  res.send('인스타그램 서버가 살아 있어요');
});

app.use('/api/posts', postsRouter);


// 404 처리를 기본설정에서 커스텀설정으로 변경
app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 존재하지 않습니다.'
  });
});


// 전역 예외처리 구간 
app.use((err, req, res, next) => {

  // 서비스쪽에서 에러를 던지면 받아줄 코드를 작성
  if (err instanceof HttpError) {
    const body = { message: err.message };
    if (err.details) body.details = err.details;
    res.status(err.status).json(body);
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
