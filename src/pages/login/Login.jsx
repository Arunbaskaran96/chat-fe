import { Link, useNavigate } from "react-router-dom";
import classes from "./login.module.css";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ChatState } from "../../context/ChatProvider";
import { FaEye } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setItem } = useLocalStorage("user");
  const { setUser } = ChatState();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch("https://chatapi-d2fo.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await data.json();
      if (result.success === false) {
        setError(result.message);
      } else {
        setItem(result);
        setUser(result);
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const generateAuth = () => {
    setFormData({
      ...formData,
      email: "arun@gmail.com",
      password: "Arun",
    });
  };

  return (
    <div className={classes.container}>
      <div style={{ width: "500px" }}>
        <div className={classes.top}>
          <p>Chat-Web</p>
        </div>
        <div className={classes.form}>
          <div className={classes.formTop}>
            <Link to="/" className={classes.login}>
              Login
            </Link>
            <Link to="/register" className={classes.signup}>
              Signup
            </Link>
          </div>
          <hr />
          <div className={classes.formContainer}>
            <form onSubmit={handleSubmit}>
              <label className={classes.label}>Email</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  id="email"
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  type="email"
                  className={classes.input}
                  defaultValue={formData.email}
                />
              </div>
              <br />
              <label className={classes.label}>Password</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  id="password"
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  type={!passwordVisible ? "password" : "text"}
                  className={classes.input}
                  defaultValue={formData.password}
                />
                <span
                  onClick={() =>
                    setPasswordVisible((passwordVisible) => !passwordVisible)
                  }
                >
                  <FaEye />
                </span>
              </div>
              <br />
              <input className={classes.loginBtn} type="submit" value="Login" />
              <button
                onClick={generateAuth}
                type="button"
                className={classes.auth}
              >
                Generate Login
              </button>
            </form>
          </div>
          {error && <p className={classes.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
