import { prisma } from '../db.js';
import { NotFoundError } from '../errors.js';

// 게시물 목록 전체 조회
export function getPosts({ username, limit }) {
  return prisma.post.findMany({
    where: { username },
    orderBy: { createdAt: 'desc' },
    take: limit,
  }); // SELECT * FROM posts WHERE username = 'minji' ORDER BY created_at DESC LIMIT 2;
}

// 단일 게시물 조회
export async function getPost(id) {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    throw new NotFoundError('그런 게시물은 없습니다.');
  }

  return post;
}

// 게시물 생성
export function createPost(data) {
  return prisma.post.create({ data });
}

export async function updatePost(id, data) {
  try {
    return await prisma.post.update({ where: { id }, data });
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    throw error;
  }
}

export async function removePost(id) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') throw new NotFoundError('그런 게시물은 없어요');
    throw error;
  }
}