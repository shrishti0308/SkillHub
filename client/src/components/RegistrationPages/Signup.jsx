import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useDispatch } from 'react-redux';
import { signup } from '../../redux/actions/authActions'; // Adjust path if necessary
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from '../../api/axiosInstance';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    email: '',
  });

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!userInfo.name) errors['name'] = true;
    if (!userInfo.username) errors['username'] = true;
    if (!userInfo.email) errors['email'] = true;
    if (!password) errors['password'] = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setShowRoleSelection(true);
  };

  const handleRoleSelectionSubmit = async () => {
    try {
      await dispatch(signup(userInfo, password, role)); // Dispatch the signup action
      console.log('User registered successfully');
      navigate('/'); // Redirect to home page
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex justify-center items-center">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg text-center min-w-[325px] sm:min-w-[60%] lg:min-w-[35%] max-w-[90%] my-10">
        <img src="/logo.png" className='mx-auto w-20' alt="" />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

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
              {['name', 'username', 'email'].map((field, index) => (
                <div className="relative mb-5" key={index}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    value={userInfo[field]}
                    onChange={handleUserInfoChange}
                    placeholder={field.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    className={`w-full p-3 border ${formErrors[field] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  />
                </div>
              ))}

              <div className="relative mb-5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full p-3 border ${formErrors['password'] ? 'border-red-600' : 'border-gray-600'} bg-gray-700 text-white rounded-lg text-lg placeholder-gray-400 transition focus:outline-none focus:ring focus:ring-blue-500`}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-400" onClick={togglePasswordVisibility}>
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
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg text-gray-400" onClick={toggleConfirmPasswordVisibility}>
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
                <a href="/login" className="text-blue-400 hover:underline">Log in</a>
              </p>
            </form>
          </>
        ) : (
          <div className="mt-5">
            <h2 className="text-2xl mb-5 text-white font-semibold">How do you like to join?</h2>
            <div className="grid grid-cols-1 gap-4">
              {['Freelancer', 'Enterprise', 'Hybrid'].map((roleOption, index) => (
                <label key={index} className="relative flex cursor-pointer items-center p-5 rounded-lg shadow-md transition hover:shadow-lg" htmlFor={roleOption.toLowerCase()}>
                  <div className='relative'>
                    <input
                      name="role"
                      type="radio"
                      id={roleOption.toLowerCase()}
                      value={roleOption.toLowerCase()}
                      className="absolute peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-white checked:border-blue-400 transition-all before:content[''] before:absolute before:-top-[50%] before:-left-[50%] before:block before:h-9 before:w-9 before:rounded-full before:bg-blue-400 before:opacity-0 before:transition-opacity hover:before:opacity-10 transform -translate-x-1/2 -translate-y-1/2"
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    <span className="absolute bg-blue-400 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                  </div>

                  <div className="max-w-[80%] mx-auto">
                    <span className="text-2xl text-white font-semibold capitalize">{roleOption}</span>
                    <p className="description text-gray-300 text-md mt-2">
                      {roleOption === 'Freelancer' && <>Engage in projects by completing tasks assigned by clients. <br />* Commission: 0.5%</>}
                      {roleOption === 'Enterprise' && <>Post projects for freelancers to undertake. <br />* Commission: 1%</>}
                      {roleOption === 'Hybrid' && <>Participate in both posting and completing projects, offering the greatest flexibility. <br />* Commission: 1.5%</>}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <button
              type="button"
              style={{ backgroundColor: 'rgb(37, 99, 235)', color: 'white', border: '2px solid rgb(37, 99, 235)' }}
              className="w-full py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200 text-xl mt-5"
              onClick={handleRoleSelectionSubmit}
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
