// ~/instagram-api/check.js
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const posts = await prisma.post.findMany({ orderBy: { id: 'asc' } });
// console.log(`게시물${posts.length}개를 읽었어요.`);

const withComments = await prisma.post.findMany({
  include: { comments: true },
  orderBy: { id: 'asc' },
});
// console.log(withComments);

for (const post of withComments) {
  console.log(`첫번째 댓글 정보: `, post.comments[0]);
  console.log(`${post.id}번${post.postAlt} — 댓글${post.comments.length}개`);
}

await prisma.$disconnect();
