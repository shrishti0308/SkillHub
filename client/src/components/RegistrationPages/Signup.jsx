import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errors = {};

    const requiredFields = ['first-name', 'username', 'email', 'password'];
    requiredFields.forEach(field => {
      if (!e.target[field].value) {
        errors[field] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // No need to set errorMessage
    }

    setFormErrors({});
    setShowRoleSelection(true);
  };

  const handleRoleSelection = () => {
    console.log(`Selected role: ${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex justify-center items-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-md text-center">
        {!showRoleSelection ? (
          <>
            <h2 className="text-3xl mb-2 text-white font-semibold">Create an Account</h2>
            <p className="text-gray-300 mb-5">Join our community and get started today!</p>

            <button className="bg-gray-700 text-gray-300 w-full py-3 rounded-md flex justify-center items-center mb-6 hover:bg-gray-600 transition duration-200">
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              Continue with Google
            </button>

            <div className="flex items-center justify-center mb-6 text-gray-400">
              <div className="flex-grow h-px bg-gray-600"></div>
              <span className="px-3">OR</span>
              <div className="flex-grow h-px bg-gray-600"></div>
            </div>

            <form onSubmit={handleSignup}>
              <div className="relative mb-5">
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  placeholder="First Name"
                  className={`w-full p-3 border ${formErrors['first-name'] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  style={formErrors['first-name'] ? { borderColor: 'red' } : {}}
                />
              </div>
              <div className="relative mb-5">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className={`w-full p-3 border ${formErrors['username'] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  style={formErrors['username'] ? { borderColor: 'red' } : {}}
                />
              </div>
              <div className="relative mb-5">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full p-3 border ${formErrors['email'] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  style={formErrors['email'] ? { borderColor: 'red' } : {}}
                />
              </div>

              <div className="relative mb-5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full p-3 border ${formErrors['password'] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  onChange={(e) => setPassword(e.target.value)}
                  style={formErrors['password'] ? { borderColor: 'red' } : {}}
                />
                <span
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {password.length >= 6 && (
                <div className="relative mb-5">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-400"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
              )}

              <button 
                type="submit" 
                style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white', border: '2px solid rgb(37, 99, 235)' }}
                className="w-full py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 text-xl"
              >
                Get Started Now
              </button>

              <p className="mt-5 text-sm text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-blue-400 hover:underline">
                  Log in
                </a>
              </p>
            </form>
          </>
        ) : (
          <div className="mt-5">
            <h2 className="text-2xl mb-5 text-white font-semibold">How do you like to join?</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Freelancer', 'Enterprise', 'Hybrid'].map((roleOption, index) => (
                <div key={index} className="bg-gray-700 p-5 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
                  <input type="radio" id={roleOption.toLowerCase()} name="role" value={roleOption.toLowerCase()} required className="mr-2" onChange={(e) => setRole(e.target.value)} />
                  <label htmlFor={roleOption.toLowerCase()} className="text-lg text-white font-semibold">{roleOption}</label>
                  <p className="description text-gray-400 text-sm mt-2">
                    {roleOption === 'Freelancer' && (
                      <>Engage in projects by completing tasks assigned by clients. <br />* Commission: 0.5%</>
                    )}
                    {roleOption === 'Enterprise' && (
                      <>Post projects for freelancers to undertake. <br />* Commission: 1%</>
                    )}
                    {roleOption === 'Hybrid' && (
                      <>Participate in both posting and completing projects, offering the greatest flexibility. <br />* Commission: 1.5%</>
                    )}
                  </p>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white', border: '2px solid rgb(37, 99, 235)' }}
              className="w-full py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 text-xl mt-5"
              onClick={handleRoleSelection}
            >
              Start your Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
