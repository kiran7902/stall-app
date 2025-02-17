"use client";


import { useState } from "react";
import { auth } from "../../firebaseConfig"
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import HomePage from "./Homepage"

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
      setError("Google login failed. Please try again.");
    }
  };

  // Email/Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid email or password.");
    }
  };

  // Email/Password sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-up failed", error);
      setError("Sign-up failed. Try a stronger password.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (user) {
    return <HomePage user={user} handleLogout={handleLogout} />;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>Welcome to Stall: Please Login</p>

      {/* Google Sign-In Button */}
      <button onClick={handleGoogleLogin}>Sign in with Google</button>

      <hr style={{ margin: "20px 0" }} />

      {/* Email/Password Login Form */}
      <form onSubmit={handleEmailLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: "block", margin: "5px 0" }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: "block", margin: "5px 0" }}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Sign-Up Button */}
      <p>Don't have an account?</p>
      <button onClick={handleSignUp}>Sign Up</button>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}