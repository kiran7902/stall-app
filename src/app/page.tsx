"use client";

import { useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import HomePage from "./Homepage";
import { db } from "../../firebaseConfig"; // Firestore instance


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false); // Tracks whether user is on sign-up screen\
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

      // Store first name and last name (you'd need Firestore to save user details)
      await setDoc(doc(db, "users", result.user.uid), {
        username,
        firstName,
        lastName,
        email
      });
  
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {isSigningUp ? "Create an Account" : "Welcome to Stall"}
        </h2>
        <p className="text-center text-gray-600 mb-4">
          {isSigningUp ? "Sign up to get started" : "Please login to continue"}
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {isSigningUp ? (
          // Sign-up form
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSigningUp(false)}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        ) : (
          // Login form
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        )}

        {!isSigningUp && (
          <>
            {/* Google Sign-In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            {/* Sign-Up Link */}
            <p className="text-sm text-gray-600 text-center mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSigningUp(true)}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}




