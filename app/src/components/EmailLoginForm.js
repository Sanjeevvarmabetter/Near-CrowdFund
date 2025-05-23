import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import EmailLoginForm from './EmailLoginForm';

export default function Login() {
  const { loginWithEmail, authError } = useAuth();
  const router = useRouter();

  const handleLogin = async (email, password) => {
    const success = await loginWithEmail(email, password);
    if (success) router.push('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Please Login to continue
        </h2>

        <EmailLoginForm onLogin={handleLogin} authError={authError} />
      </div>
    </div>
  );
}
