import express from 'express';
import * as postService from '../services/postService.js';

const router = express.Router();

// URI에 있는 id값을 추출해서 숫자로 변환하고, 숫자가 아닐경우 에러를 응답하는 함수
function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }
  req.postId = id; // 검증이 끝난 id를 req에 저장
  next(); // 다음번 미들웨어함수로 진행
}

// 전체 게시물 목록 서빙
router.get('/', async (req, res) => {
  const posts = await postService.getPosts({
    username: req.query.username,
    limit: Number(req.query.limit) || undefined,
  });
  res.json(posts);
});

// 단일 게시물 서빙
router.get('/:id', parseId, async (req, res) => {

  const post = await postService.getPost(req.postId);

  if (!post) {
    res.status(404).json({
      message: '그런 게시물은 존재하지 않습니다.',
    });
    return;
  }

  res.json(post);
});

router.post('/', async (req, res) => {
  // 입력값 검증 (validation)
  const { username, profileImage, postImage, postAlt, content } = req.body;

  if (!username || !postImage) {
    res.status(400).json({ message: 'username과 postImage는 꼭 있어야 해요' });
    return;
  }

  // 실제로 게시물을 추가해 줘야함.
  const newPost = await postService.createPost({
    username, profileImage, postImage, postAlt, content
  });

  res.status(201).json(newPost);
});

// 좋아요 수정요청
router.patch('/:id', parseId, async (req, res) => {

  const { username, profileImage, postImage, postAlt, content, likeCount } = req.body;

  const post = await postService.updatePost(req.postId, {
    username,
    profileImage,
    postImage,
    postAlt,
    content,
    likeCount,
  });

  if (!post) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  res.json(post);
});

// 게시물 삭제
router.delete('/:id', parseId, async (req, res) => {

  // DELETE FROM posts WHERE id = ?
  const deleted = await postService.removePost(req.postId);

  if (!deleted) {
    res.status(404).json({ message: '그런 게시물은 없어요' });
    return;
  }

  res.json(deleted);
});


export default router;