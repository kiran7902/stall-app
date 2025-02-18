// Work in Progress - but will probably need when app gets more complex

/*

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import HomePage from './Homepage';
import Bathrooms from './Bathrooms';
import Login from './page';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route 
              path="/" 
              element={<HomePage user={user} handleLogout={handleLogout} />} 
            />
            <Route 
              path="/bathrooms" 
              element={<Bathrooms />} 
            />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

*/