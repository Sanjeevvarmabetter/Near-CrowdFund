import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import Signup from './Signup'; 

export default function Login() {
  const { loginWithGoogle, loginWithEmail, loading, authError } = useAuth();
  const router = useRouter();

  const [showSignup, setShowSignup] = useState(false); // Toggle signup/login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) router.push('/');
  };

  const handleEmailLogin = async () => {
    setLocalError('');
    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      const success = await loginWithEmail(email, password);
      if (success) router.push('/');
    } catch (err) {
      setLocalError('Invalid credentials or user not found');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          {showSignup ? 'Create an Account' : 'Please Login to continue'}
        </h2>

        {!showSignup && (authError || localError) && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {authError || localError}
          </div>
        )}

        <div className="space-y-4">
          {showSignup ? (
            <Signup />
          ) : (
            <>
              {/* Email + Password Login */}
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Password"
                />
                <button
                  onClick={handleEmailLogin}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                  Login
                </button>
              </div>

              {/* OR */}
              <div className="text-center text-gray-400 text-sm mt-4">OR</div>

              {/* Google Login */}
              <GoogleLoginButton
                onClick={handleGoogleLogin}
                disabled={loading}
              />

              <p className="text-center text-gray-400 text-sm mt-4">
                Only authorized Google accounts can access this Create
              </p>
            </>
          )}

          {/* Toggle between Login and Signup */}
          <p className="text-center text-gray-300 text-sm mt-6">
            {showSignup ? (
              <>
                Already have an account?{' '}
                <span
                  className="text-blue-400 hover:underline cursor-pointer"
                  onClick={() => setShowSignup(false)}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <span
                  className="text-blue-400 hover:underline cursor-pointer"
                  onClick={() => setShowSignup(true)}
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
