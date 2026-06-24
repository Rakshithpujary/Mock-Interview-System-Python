import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const serverURL = process.env.REACT_APP_SERVER_URL;

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${serverURL}/api/signup`, {
        name,
        email,
        password,
      });

      alert("Account Created");
      navigate("/login");
    } catch (err) {
      alert("Signup Failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
        <input
          className="form-control mb-3"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success">Sign Up</button>
      </form>

      <p className="mt-3">
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;
