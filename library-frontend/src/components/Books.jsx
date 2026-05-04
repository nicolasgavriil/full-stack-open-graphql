import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS } from "../queries.js";

const Books = ({ show }) => {
  const [filter, setFilter] = useState();
  const booksResult = useQuery(ALL_BOOKS);
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: "cache-and-network",
  });

  if (!show) return null;

  if (booksResult.loading || filteredResult.loading) return null;

  const books = booksResult.data.allBooks;
  const filteredBooks = filteredResult.data.allBooks;

  if (!books || !filteredBooks) return null;

  const genres = new Set();
  for (const book of books) {
    book.genres.forEach((genre) => {
      genres.add(genre);
    });
  }

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <p>
          in genre: <b>{filter}</b>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setFilter(null)}>
        all genres
      </button>
      {[...genres].sort().map((g) => (
        <button key={g} type="button" onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
