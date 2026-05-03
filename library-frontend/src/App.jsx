import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_AUTHORS } from "./queries.js";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("graphql-user-token"),
  );
  const [page, setPage] = useState("authors");
  const result = useQuery(ALL_AUTHORS);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("logout")}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {!result.loading && (
        <Authors show={page === "authors"} authors={result.data.allAuthors} />
      )}

      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <LoginForm show={page === "login"} setToken={setToken} />
      <Logout show={page === "logout"} setToken={setToken} />
    </div>
  );
};

export default App;
