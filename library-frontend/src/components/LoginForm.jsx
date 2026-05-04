import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN, USER_DATA } from "../queries";

const LoginForm = ({ show, setPage, setError, setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;

      setToken(token);
      localStorage.setItem("graphql-user-token", token);

      setPage("books");
    },
    onError: (err) => {
      setError(`Login failed: ${err.message}`);
    },
  });

  if (!show) return null;

  const submit = (e) => {
    e.preventDefault();
    login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
