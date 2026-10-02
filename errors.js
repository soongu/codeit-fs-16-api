// ~/instagram-api/errors.js
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}


export class NotFoundError extends HttpError {
  constructor(message) {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message, details) {
    super(400, message);
    this.details = details;
  }
}


// class Human {
//   constructor(username, age) {
//     this.username = username;
//     this.age = age;
//   }
// }

// new Human('kim', 30); // { username: 'kim', age: 30 }
// new Human('park', 40); // { username: 'park', age: 40 }
