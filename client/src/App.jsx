import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import LoginPage from './components/RegistrationPages/Login';
import SignupPage from './components/RegistrationPages/Signup';

function App() {

  return (
    <>
      <div className=' bg-dark text-light w-screen min-h-screen overflow-x-hidden'>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1 className=' text-lg' >Site under development</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </>
  )
}

export function APPwithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}