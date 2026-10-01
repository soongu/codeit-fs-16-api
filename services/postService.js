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