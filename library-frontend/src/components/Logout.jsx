import { useApolloClient } from "@apollo/client/react";

const Logout = ({ show, setToken }) => {
  if (!show) return null;

  const client = useApolloClient();

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <button type="button" onClick={onLogout}>
      logout
    </button>
  );
};

export default Logout;
