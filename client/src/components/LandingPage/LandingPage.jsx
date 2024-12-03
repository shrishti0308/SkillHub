import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="text-white" style={{ backgroundColor: '#B0E0E6' }}>
      {/* Hero Section */}
      <section
        className="h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(freelance.png)' }}
      >
        <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-2xl">
          <h1 className="text-5xl font-bold mb-4 text-center text-yellow-300 drop-shadow-lg">
            Welcome to Skill Hub
          </h1>
          <p className="text-lg text-center mb-6 text-gray-300">
            Connect with top talent, find freelance jobs, and grow your business.
          </p>
          {/* Centering the button */}
          <div className="flex justify-center">
            <Link to="/features" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >Get Started</Link>
          </div>
        </div>
      </section>


      {/* Get Work Done in 150+ Categories Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Get work done in <span className="text-pink-500">over 150+</span> different categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories Columns */}
            <div className="space-y-2">
              <p>Website Design</p>
              <p>Mobile Apps</p>
              <p>Android Apps</p>
              <p>iPhone Apps</p>
              <p>Software Architecture</p>
              <p>Graphic Design</p>
              <p>Logo Design</p>
              <p>Public Relations</p>
              <p>Logistics</p>
              <p>Proofreading</p>
              <p>Translation</p>
              <p>Research</p>
            </div>
            <div className="space-y-2">
              <p>Research Writing</p>
              <p>Article Writing</p>
              <p>Web Scraping</p>
              <p>HTML</p>
              <p>CSS</p>
              <p>HTML 5</p>
              <p>Javascript</p>
              <p>Data Processing</p>
              <p>Python</p>
              <p>Wordpress</p>
              <p>Web Search</p>
              <p>Finance</p>
            </div>
            <div className="space-y-2">
              <p>Legal</p>
              <p>Linux</p>
              <p>Manufacturing</p>
              <p>Data Entry</p>
              <p>Content Writing</p>
              <p>Marketing</p>
              <p>Excel</p>
              <p>Ghostwriting</p>
              <p>Copywriting</p>
              <p>Accounting</p>
              <p>MySQL</p>
              <p>C++ Programming</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Freelancer Service */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold mb-4">Freelancer</h3>
              <p className="text-gray-300 mb-6">
                Ideal for individual freelancers looking to showcase their skills and connect with clients for freelance jobs. We just take 0.5% commission in this service.
              </p>
              <a
                href="#"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
            {/* Enterprise Service */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold mb-4">Enterprise</h3>
              <p className="text-gray-300 mb-6">
                Designed for businesses and large enterprises seeking to hire top talent for long-term projects and specialized tasks. We just take 1% commission in this service.
              </p>
              <a
                href="#"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
            {/* Hybrid Service */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold mb-4">Hybrid</h3>
              <p className="text-gray-300 mb-6">
                A flexible service combining both freelance and enterprise features to cater to diverse project needs. We just take 1.5% commission in this service.
              </p>
              <a
                href="#"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Make it Real with Freelancer Section */}
      <section
        className="h-[70vh] py-32 bg-gray-100 text-gray-200 bg-cover bg-center"
        style={{ backgroundImage: 'url(freelance1.png)' }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8 text-white">Make it Real with Freelancer</h2>
          <p className="text-lg font-bold text-center mb-12 max-w-5xl mx-auto text-white">
            Skill Hub is a thriving community where creativity and opportunity converge. With our user-friendly interface, freelancers can create impactful profiles, and businesses can find talent with ease. Join us and turn your ideas into reality!
          </p>
        </div>
      </section>

      {/* Tap into a Global Talent Network Section */}
      <section
        className="h-[70vh] py-32 bg-gray-800 text-white bg-cover bg-center"
        style={{ backgroundImage: 'url(global-background.jpg)' }} // Replace with the correct image path
      >
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold mb-8">Tap into a Global Talent Network</h2>
            <p className="text-lg mb-12 max-w-3xl">
              Connect with top talent from around the world. Leverage our global network to find the perfect professionals for your projects, regardless of scale or complexity. Explore limitless possibilities and take your business to the next level.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="globaltalentnetwork.jpeg" // Replace this with the path to your desired image
              alt="Global Talent Network"
              className="rounded-lg shadow-lg w-full h-full md:max-w-6xl md:max-h-96"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <a
            href="#"
            className="bg-white hover:bg-gray-300 text-blue-600 font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
          >
            Sign Up Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ backgroundColor: '#B0E0E6' }}>
        <div className="container mx-auto text-center">
          <p className="text-gray-500">© 2024 Skill Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

