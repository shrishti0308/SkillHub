import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex justify-center items-center">
      <div className="bg-gray-800 py-10 px-8 rounded-lg shadow-lg min-w-[325px] sm:min-w-[60%] lg:min-w-[35%] max-w-[90%]">
        <img src="/logo.png" className=' mx-auto w-20' alt="" />
        <h2 className="text-3xl text-white font-bold text-center mb-6">Welcome Back</h2>

        <button className="bg-gray-700 text-gray-300 w-full py-3 rounded-md flex justify-center items-center mb-6 hover:bg-gray-600 transition duration-200">
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
          Continue with Google
        </button>

        <div className="flex items-center justify-center mb-6 text-gray-400">
          <div className="flex-grow h-px bg-gray-600"></div>
          <span className="px-3">OR</span>
          <div className="flex-grow h-px bg-gray-600"></div>
        </div>

        <form action="/login" method="POST" className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="email-username"
              name="email_username"
              placeholder="Email or Username"
              className="w-full p-3 border-2 border-blue-400 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border-2 border-blue-400 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150"
              required
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white', border: '2px solid rgb(37, 99, 235)' }}
            className="w-full py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 text-xl"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {"Don't have an account? "}
          <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
