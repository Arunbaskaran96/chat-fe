import { Link, useNavigate } from "react-router-dom";
import classes from "./register.module.css";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passFailed, setPassFiled] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = (image) => {
    setImageUploading(true);
    const storage = getStorage(app);
    const fileName = image.name + new Date().getMinutes();
    const storageRef = ref(storage, fileName);
    const upload = uploadBytesResumable(storageRef, image);

    upload.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, pic: downloadURL });
        });
      }
    );
    setImageUploading(false);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password != confirmPassword) {
      setPassFiled(true);
    } else {
      const result = await fetch(
        "https://chatapi-d2fo.onrender.com/api/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await result.json();
      if (data.success === false) {
      } else {
        navigate("/");
      }
    }
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
              <label className={classes.label}>Name</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  id="name"
                  placeholder="Enter Your Name"
                  type="text"
                  className={classes.input}
                  defaultValue={formData.name}
                  onChange={handleChange}
                />
              </div>
              <label className={classes.label}>Email</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Email"
                  type="email"
                  className={classes.input}
                  id="email"
                  defaultValue={formData.email}
                  onChange={handleChange}
                />
              </div>
              <label className={classes.label}>Password</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Enter Your Password"
                  type="password"
                  className={classes.input}
                  id="password"
                  defaultChecked={formData.password}
                  onChange={handleChange}
                />
              </div>
              <label className={classes.label}>Confirm Password</label>
              <br />
              <div className={classes.inputContainer}>
                <input
                  placeholder="Re-Enter Your Password"
                  type="password"
                  className={classes.input}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                onChange={handleImage}
              />
              {/* <input
                dis
                className={classes.loginBtn}
                type="submit"
                value="Login"
              /> */}
              <button disabled={imageUploading} className={classes.loginBtn}>
                {imageUploading ? "image is uploading" : "Register"}
              </button>
              {passFailed && (
                <p style={{ color: "red" }}>
                  Password and confirm password mismatch
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
