import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">micro-saas.online</h1>
      <p className="text-xl text-gray-600 mb-12 text-center">Your marketplace for innovative SaaS solutions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* SaaS Product Card 1: Valentine Digital Gift */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">Valentine Digital Gift</h2>
          <p className="text-gray-700 mb-4">Create personalized digital gift experiences for your loved ones.</p>
          <Link to="/valentine/z90ab6s6" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            Explore
          </Link>
        </div>

        {/* SaaS Product Card 2: PDF to Text Converter */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">PDF to Text Converter</h2>
          <p className="text-gray-700 mb-4">Quickly convert PDF documents into editable text files.</p>
          <Link to="/pdf-to-text" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            Learn More
          </Link>
        </div>

        {/* SaaS Product Card 3: Placeholder SaaS */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Another Awesome SaaS</h2>
          <p className="text-gray-700 mb-4">Discover more innovative tools coming soon to our marketplace.</p>
          <Link to="/coming-soon" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
            Coming Soon
          </Link>
        </div>
      </div>

      <p className="text-gray-500 mt-12">Are you an admin? <Link to="/admin" className="text-indigo-600 hover:underline">Go to Admin Page</Link></p>
    </div>
  );
};

export default HomePage;
