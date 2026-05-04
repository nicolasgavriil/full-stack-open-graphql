import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_AUTHORS } from "./queries.js";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend.jsx";
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";
import Notify from "./components/Notify";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("graphql-user-token"),
  );
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_AUTHORS);

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={() => setPage("logout")}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>
      <Notify errorMessage={errorMessage} />
      {!result.loading && (
        <Authors
          show={page === "authors"}
          authors={result.data.allAuthors}
          token={token}
        />
      )}

      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <Recommend show={page === "recommend"} />
      <LoginForm
        show={page === "login"}
        setPage={setPage}
        setError={notify}
        setToken={setToken}
      />
      <Logout show={page === "logout"} setToken={setToken} />
    </div>
  );
};

export default App;
