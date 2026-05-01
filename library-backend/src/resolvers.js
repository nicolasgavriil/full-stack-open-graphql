const Author = require("../models/Author.js");
const Book = require("../models/Book.js");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const authorExists = await Author.findOne({ name: args.author });
      if (!authorExists) return null;
      const authorId = authorExists.id;

      const filter = {};
      if (args.author) filter.author = authorId;
      if (args.genre) filter.genres = args.genre;

      return Book.find(filter).populate("author");
    },
    allAuthors: async () => Author.find({}),
  },

  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id });
      return books.length;
    },
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
      const savedBook = await book.save();
      return savedBook.populate("author");
    },
    editAuthor: async (root, args) => {
      const authorToEdit = await Author.findOne({ name: args.name });
      if (!authorToEdit) return null;
      authorToEdit.born = args.setBornTo;

      return authorToEdit.save();
    },
  },
};

module.exports = resolvers;
