const Author = require("../models/Author.js");
const Book = require("../models/Book.js");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => Book.find({}),
    allAuthors: async () => Author.find({}),
  },

  Author: {
    bookCount: (root) => 0,
  },

  Mutation: {
    addBook: async (root, args) => {
      const authorExists = await Author.findOne({ name: args.author });
      let authorId;
      if (!authorExists) {
        const newAuthor = new Author({ name: args.author });
        const savedAuthor = await newAuthor.save();
        authorId = savedAuthor.id;
      } else {
        authorId = authorExists.id;
      }

      const book = new Book({ ...args, author: authorId });
      return book.save();
    },
    editAuthor: (root, args) => {
      const authorToEdit = authors.find((a) => a.name === args.name);
      if (!authorToEdit) return null;
      const updatedAuthor = { ...authorToEdit, born: args.setBornTo };
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
      return updatedAuthor;
    },
  },
};

module.exports = resolvers;
