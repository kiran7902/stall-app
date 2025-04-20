"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setIsDarkMode] = useState(false);
  const router = useRouter();

  // Check for system dark mode preference
  useEffect(() => {
    const checkDarkMode = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
      }
    };

    // Initial check
    checkDarkMode();

    // Listen for changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Firebase auth persistance for session
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
        if (loggedInUser) {
          router.push('/');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    })
    .catch((error) => console.error("Auth persistance error:", error));
  }, [router]);
  
  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Login failed", error);
      setError("Google login failed. Please try again.");
    }
  };

  // Email/Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid email or password.");
    }
  };

  // Email Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's displayName with firstName and lastName
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Store additional user details in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        username,
        firstName,
        lastName,
        email
      });

      router.push('/');
    } catch (error) {
      console.error("Sign-up failed", error);
      setError("Sign-up failed. Try a stronger password.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {isSigningUp ? "Create an Account" : "Welcome to Stall"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          {isSigningUp ? "Sign up to get started" : "Please login to continue"}
        </p>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        {isSigningUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSigningUp(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <button
              onClick={handleGoogleLogin}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Image src="/icons/google_logo.png" alt="Google" width={22} height={22} />
              <span className="text-gray-700 dark:text-gray-300">Sign in with Google</span>
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSigningUp(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
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