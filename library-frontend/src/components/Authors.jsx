import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries.js";

const Authors = ({ show, authors, token }) => {
  const [name, setName] = useState(authors[0]?.name || "");
  const [birthyear, setBirthyear] = useState("");

  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (err) => console.log(err),
  });

  if (!show || !authors) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    editBirthyear({ variables: { name, setBornTo: parseInt(birthyear) } });

    setName(authors[0]?.name || "");
    setBirthyear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={handleSubmit}>
            <div>
              name
              <select
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="born">born</label>
              <input
                id="born"
                value={birthyear}
                onChange={(e) => setBirthyear(e.target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
