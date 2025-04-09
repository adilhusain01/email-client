import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");

  const handleLogout = () => {
    setUser(null);
    setStatus("");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");

    if (userParam) {
      try {
        const userData = JSON.parse(userParam);
        setUser(userData);
        // Clean up the URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gmail Spam Filter</h1>
        <p>Automatically detect and label spam emails in your Gmail account</p>

        {!user ? (
          <div className="login-container">
            <p>Connect your Gmail account to get started:</p>

            <GoogleLogin
              flow="auth-code"
              ux_mode="redirect"
              redirect_uri="http://localhost:5000/api/auth/google/callback"
              scope="https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify"
              onSuccess={() => {}} // Google handles redirect
              onError={() => setStatus("Login failed")}
              useOneTap={false}
            />

            {status && <p className="status-message">{status}</p>}
          </div>
        ) : (
          <div className="user-container">
            <div className="user-info">
              <img
                src={user.picture}
                alt={user.name}
                className="profile-image"
              />
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <p className="success-message">
              ✅ Your Gmail account is connected to our spam filter!
            </p>
            <p className="info-message">
              We'll automatically analyze your incoming emails and label spam
              accordingly.
            </p>
            <button onClick={handleLogout} className="logout-button">
              Disconnect Account
            </button>
          </div>
        )}
      </header>
      <footer>
        <p>
          Your data is secure. We only process emails to detect spam and never
          store email content.
        </p>
      </footer>
    </div>
  );
}

export default App;
