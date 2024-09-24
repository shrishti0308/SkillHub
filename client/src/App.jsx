import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import LoginPage from './components/RegistrationPages/Login';
import SignupPage from './components/RegistrationPages/Signup';
import ProfileSettings from './components/ProfilePage/ProfileSettings';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      <div className='bg-dark text-light w-screen min-h-screen overflow-x-hidden'>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
          <Route path="/" element={<h1 className='text-lg'>Site under development</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<h1 className=' text-lg' >Site under development</h1>} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Routes>
      </div>
    </>
  );
}

export function APPwithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
