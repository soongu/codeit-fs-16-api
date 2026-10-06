import express from 'express';
import * as postService from '../services/postService.js';
import * as likeService from '../services/likeService.js';
import { NotFoundError } from '../errors.js';
import {
  validateBody
} from '../middlewares/validate.js';
import { postCreateSchema, postUpdateSchema } from '../schemas/postSchema.js';

const router = express.Router();

function parseUserId(req, res, next) {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId)) {
    next(new NotFoundError('그런 사용자는 없어요'));
    return;
  }

  req.userId = userId;
  next();
}

// URI에 있는 id값을 추출해서 숫자로 변환하고, 숫자가 아닐경우 에러를 응답하는 함수
function parseId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    next(new NotFoundError('그런 게시물은 없어요.'));
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

  res.status(200).json(post);
});


router.post('/', validateBody(postCreateSchema), async (req, res) => {

  // 실제로 게시물을 추가해 줘야함.
  const newPost = await postService.createPost(req.body);

  res.status(201).json(newPost);
});

// 좋아요 수정요청
router.patch('/:id', parseId, validateBody(postUpdateSchema), async (req, res) => {

  const post = await postService.updatePost(req.postId, req.body);

  res.json(post);
});

// 게시물 삭제
router.delete('/:id', parseId, async (req, res) => {

  // DELETE FROM posts WHERE id = ?
  const deleted = await postService.removePost(req.postId);

  res.json(deleted);
});

router.get('/:id/likes', parseId, async (req, res) => {
  const usernames = await likeService.getLikers(req.postId);

  res.json(usernames);
});

// 「3번 게시물에 2번 사람이 누른 좋아요」 하나를 주소로 가리킨다.
// 있게 만들기(PUT)와 없게 만들기(DELETE) — 둘 다 몇 번을 보내도 결과가 같다.
router.put('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.likePost(req.postId, req.userId);

  res.json(status);
});

router.delete('/:id/likes/:userId', parseId, parseUserId, async (req, res) => {
  const status = await likeService.unlikePost(req.postId, req.userId);

  res.json(status);
});


export default router;