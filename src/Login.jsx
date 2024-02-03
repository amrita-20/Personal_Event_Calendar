import { useState } from "react";
import "./Login.css";
import Button from "./Button";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = (e, username) => {
    e.preventDefault();
    onLogin(username);
  };
  return (
    <div className="login-container">
      <form className="login-form">
        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          value={username}
          id="username"
          className="input"
          onInput={(e) => setUsername(e.target.value)}
        ></input>
        <Button
          className="button login-btn"
          type="button"
          onClick={(e) => handleLogin(e, username)}
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Login;
