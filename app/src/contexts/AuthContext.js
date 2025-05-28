import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword, // <-- added for email login
  AUTHORIZED_USERS
} from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!AUTHORIZED_USERS.includes(user.email)) {
        await signOut(auth);
        setAuthError('This email is not authorized to access the dashboard');
        return false;
      }

      setAuthError('');
      return true;
    } catch (error) {
      setAuthError('Failed to sign in with Google');
      console.error("Google login error:", error);
      return false;
    }
  };

const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Fetch role from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userDoc.exists() || userData.role !== 'admin') {
      await signOut(auth);
      setAuthError('This email is not authorized to access the dashboard');
      return false;
    }

    setAuthError('');
    return true;
  } catch (error) {
    setAuthError('Invalid email or password');
    console.error("Email login error:", error);
    return false;
  }
};
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithEmail, // exposed email login
    logout,
    loading,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
