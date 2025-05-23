import React from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleLoginButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      <FcGoogle className="text-xl" />
      <span>Sign in with Google</span>
    </button>
  );
}