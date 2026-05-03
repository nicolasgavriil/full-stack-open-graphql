import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS, USER_DATA } from "../queries.js";

const Recommend = ({ show }) => {
  const resultBooks = useQuery(ALL_BOOKS);
  const resultUser = useQuery(USER_DATA);

  if (!show) return null;

  if (resultBooks.loading || resultUser.loading) return null;

  const books = resultBooks.data.allBooks;
  const user = resultUser.data.me;

  if (!books || !user) return null;

  const filter = user.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{filter}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((b) => (filter ? b.genres.includes(filter) : true))
            .map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
