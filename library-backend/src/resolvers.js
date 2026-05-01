const { GraphQLError } = require("graphql");
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
        try {
          const newAuthor = new Author({ name: args.author });
          const savedAuthor = await newAuthor.save();
          authorId = savedAuthor.id;
        } catch (err) {
          throw new GraphQLError(`Saving new author failed: ${err.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              err,
            },
          });
        }
      } else {
        authorId = authorExists.id;
      }

      try {
        const book = new Book({ ...args, author: authorId });
        const savedBook = await book.save();
        return savedBook.populate("author");
      } catch (err) {
        throw new GraphQLError(`Saving new book failed: ${err.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            err,
          },
        });
      }
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
