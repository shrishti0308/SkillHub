import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import LoginPage from './components/RegistrationPages/Login';
import SignupPage from './components/RegistrationPages/Signup';
import ProfileSettings from './components/ProfilePage/ProfileSettings';
import ProfilePage from './components/ProfilePage/ProfilePage';
import Marketplace from './components/Marketplace/MarketPlace';
import FreelancerDashboard from './components/dashboard/FreelancerDashboard';
import JobDetails from './components/Jobs/JobDetails';
import PostJob from './components/Jobs/PostJob';
import LandingPage from './components/LandingPage/LandingPage';
import Jobs from './components/JobsPage/Jobs';
import Bids from './components/BidingsPage/Bids';
import About from './components/About';
function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/signup'];

  return (
    <>
      <div className='text-light w-screen min-h-screen overflow-x-hidden'>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/user/:username" element={<ProfilePage />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/new" element={<PostJob />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/bidings' element={<Bids />} />
          <Route path="/about" element={<About/>} />

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
