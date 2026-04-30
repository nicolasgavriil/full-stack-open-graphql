import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries.js";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const result = useQuery(ALL_AUTHORS);

  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (err) => console.log(err),
  });

  if (!props.show) return null;

  if (result.loading) return null;

  const authors = result.data.allAuthors;

  if (!authors) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    editBirthyear({ variables: { name, setBornTo: parseInt(birthyear) } });

    setName("");
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
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          born
          <input
            value={birthyear}
            onChange={(e) => setBirthyear(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
