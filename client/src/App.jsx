import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/navbar';

function App() {

  return (
    <>
      <div className=' bg-dark text-light w-screen min-h-screen overflow-x-hidden'>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1 className=' text-lg' >Site under development</h1>} />
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