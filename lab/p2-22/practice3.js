import express from 'express';

const books = [
  {
    id: 1,
    title: '자료구조론',
  },
  {
    id: 2,
    title: '알고리즘 테스트',
  },
  {
    id: 3,
    title: 'AI 2027',
  },
];


const app = express();

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = books.find((book) => book.id === id);

  if (!found) {
    res.status(404).json({ 
      message: '그런 책은 없어요.'
    });
    return;
  }
  res.json(found);
});

app.use((req, res) => {
  res.status(404).json({
    message: '그런 주소는 없어요.',
  });
});

app.listen(4000, () => {
  console.log('실습 서버가 실행중입니다.');
});