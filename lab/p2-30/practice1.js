import { bookstore } from "./bookstore.js";

const books = await bookstore.book.findMany({
  orderBy: { id: 'asc' },
});

console.log(books);

await bookstore.$disconnect();