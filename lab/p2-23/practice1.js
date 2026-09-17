import express from 'express';

const comments = [
  {
    id: 1,
    postId: 1,
    username: 'pikachu',
    text: '피카피카퓨~~',
  },
  {
    id: 2,
    postId: 1,
    username: 'heartping',
    text: '티니티니핑~~',
  },
  {
    id: 3,
    postId: 2,
    username: 'pikachu',
    text: '삐카뀨뀨뀨뀨뀨~~',
  },
];

let nextId = 4;

const app = express();

app.use(express.json());

app.get('/api/comments', (req, res) => {
  res.json(comments);
});

app.post('/api/comments', (req, res) => {

  const newComment = {
    ...req.body,
    id: nextId
  };

  nextId++;

  comments.push(newComment);

  res.status(201).json(newComment);
});


app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 없어요.',
  });
});

app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');
});
