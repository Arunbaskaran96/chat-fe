import { Link } from "react-router-dom";
import classes from "./register.module.css";

export default function Register() {
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
            <form>
              <label className={classes.label}>Name</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Email"
                  type="text"
                  className={classes.input}
                />
              </div>
              <label className={classes.label}>Email</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Password"
                  type="email"
                  className={classes.input}
                />
              </div>
              <label className={classes.label}>Password</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Password"
                  type="password"
                  className={classes.input}
                />
              </div>
              <label className={classes.label}>Confirm Password</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Password"
                  type="password"
                  className={classes.input}
                />
              </div>
              <label className={classes.label}>
                Upload Your Profile Picture
              </label>
              <br />
              <input
                placeholder="Enter Your Password"
                type="file"
                className={classes.input}
              />
              <input className={classes.loginBtn} type="submit" value="Login" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
