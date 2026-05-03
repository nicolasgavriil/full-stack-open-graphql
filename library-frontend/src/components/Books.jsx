import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS } from "../queries.js";

const Books = ({ show }) => {
  const [filter, setFilter] = useState();
  const result = useQuery(ALL_BOOKS);

  if (!show) return null;

  if (result.loading) return null;

  const books = result.data.allBooks;

  if (!books) return null;

  const genres = new Set();
  for (const book of books) {
    book.genres.forEach((genre) => {
      genres.add(genre);
    });
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => b.genres.includes(filter))
            .map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {[...genres].sort().map((g) => (
        <button key={g} type="button" onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
