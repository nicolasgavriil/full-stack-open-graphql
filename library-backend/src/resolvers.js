const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const User = require("../models/User.js");
const Author = require("../models/Author.js");
const Book = require("../models/Book.js");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const authorExists = await Author.findOne({ name: args.author });
        if (!authorExists) return [];
        filter.author = authorExists.id;
      }
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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        return user.save();
      } catch (err) {
        throw new GraphQLError(`Creating the user failed: ${err.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error: err,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

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
        const populatedBook = await savedBook.populate("author");

        pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });

        return populatedBook;
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
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const authorToEdit = await Author.findOne({ name: args.name });
      if (!authorToEdit) return null;
      authorToEdit.born = args.setBornTo;

      return authorToEdit.save();
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
