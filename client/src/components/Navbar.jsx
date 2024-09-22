import React from 'react';
import { TbLogout } from "react-icons/tb";


const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-grey p-4 shadow-md w-full fixed top-0 left-0">
      <div className="flex items-center space-x-2">
        <img 
          src="./logo.png"  // Replace with your logo image path
          alt="Logo"
          className="h-8 w-8"       // Adjust size of the logo as needed
        />
        <h3 className="text-2xl font-bold">SkillHub</h3>
      </div>

      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-dark text-light px-4 py-1.5 rounded-lg focus:outline-none"
        />
        <button className="bg-cyan-blue text-dark px-1.5 mr-2 py-1.5 rounded"><TbLogout /></button>
      </div>
    </div>
  );
};

export default Navbar;
