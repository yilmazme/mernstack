import React from "react";
import styles from "../styles/login.module.css";
import axios from "axios";
import GoogleLogin from "react-google-login";
import googlePng from "../themes/google.png";

//all props comeing from app (local login)
function Login({ handleSubmit, user, setUser, passLogOrSign }) {
  //this is just for toggle login signup modal
  const loginModal = false;
  //

  // google login is handled in this comp
  const handleToken = (accessToken, refreshToken, userId) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
  };
  const responseSuccessGoogle = async (res) => {
    await axios
      .post("/login/google", {
        tokenId: res.tokenId,
      })
      .then((response) => {
        handleToken(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.id
        );
        localStorage.setItem("logged", JSON.stringify(true));
        setTimeout(() => {
          window.location.href = `/home`;
        }, 200);
      })
      .catch((error) => {
        console.log(error.response.data);
        //setErrorMessage(error.response.data.error);
      });
  };
  const responseErrorGoogle = async (res) => {
    console.log(res);
  };

  return (
    <div className={styles.loginMain}>
      <div className={styles.banner1}>
        <p>Nothing is behind this door</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value, errorMessage: "" })
          }
          autoFocus
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value, errorMessage: "" })
          }
        />
        <button type="submit">Login</button>

        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_API_KEY}
          render={(renderProps) => (
            <button
              style={{
                backgroundColor: "#fff",
                borderRadius: "0",
                fontSize: "16px",
                height: "2rem",
                width: "12rem",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <img src={googlePng} alt="google" width="15" height="15" />
              Login with Google
            </button>
          )}
          buttonText="Login"
          onSuccess={responseSuccessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={"single_host_origin"}
        />
        <span
          onClick={() => {
            passLogOrSign(loginModal);
          }}
        >
          {"Sign up >>"}
        </span>
        {user.errorMessage && (
          <p className={styles.errorMessage}>{user.errorMessage}</p>
        )}
      </form>

      <div className={styles.banner2}>
        <p>Or maybe not, i don't know</p>
      </div>
    </div>
  );
}

export default React.memo(Login);
