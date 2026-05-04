import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { ALL_BOOKS, USER_DATA } from "../queries.js";

const Recommend = ({ show }) => {
  const booksResult = useQuery(ALL_BOOKS);
  const userResult = useQuery(USER_DATA, {
    fetchPolicy: "network-only",
    skip: !localStorage.getItem("graphql-user-token"),
  });
  const user = userResult?.data?.me;
  const filter = user?.favoriteGenre;

  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    skip: !filter,
  });

  if (!show) return null;

  const books = booksResult.data?.allBooks;
  const filteredBooks = filteredResult.data?.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      {filteredBooks && user ? (
        <>
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
              {filteredBooks?.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
};

export default Recommend;
