import { prisma } from '../db.js';

// 게시물 목록 전체 조회
export function getPosts({ username, limit }) {
  return prisma.post.findMany({
    where: { username },
    orderBy: { createdAt: 'desc' },
    take: limit,
  }); // SELECT * FROM posts WHERE username = 'minji' ORDER BY created_at DESC LIMIT 2;
}

// 단일 게시물 조회
export function getPost(id) {
  return prisma.post.findUnique({ where: { id } });
}

// 게시물 생성
export function createPost(data) {
  return prisma.post.create({ data });
}

// 게시물 수정
export function updatePost(id, data) {
  return prisma.post.update({ where: { id }, data });
}

// 게시물 삭제
export function removePost(id) {
  return prisma.post.delete({ where: { id } });
}