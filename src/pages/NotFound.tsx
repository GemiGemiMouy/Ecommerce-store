// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
    {/* Modern SVG Illustration */}
    <div className="w-64 h-64 mb-8 animate-fade-in">
      <svg
        className="w-full h-full"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="256" cy="256" r="256" fill="white" fillOpacity="0.1"/>
        <path
          d="M256 128C211.1 128 176 163.1 176 208C176 252.9 211.1 288 256 288C300.9 288 336 252.9 336 208C336 163.1 300.9 128 256 128ZM256 272C223.8 272 200 248.2 200 216C200 183.8 223.8 160 256 160C288.2 160 312 183.8 312 216C312 248.2 288.2 272 256 272Z"
          fill="gray"
        />
        <path
          d="M176 368C176 368 208 336 256 336C304 336 336 368 336 368"
          stroke="gray"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </svg>
    </div>

    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 animate-fade-in">
      404
    </h1>
    <p className="text-2xl md:text-2xl text-gray-700 mb-8 animate-fade-in delay-200">
      Oops! The page you’re looking for doesn’t exist.
    </p>
    
    <Link
      to="/"
      className="inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-fade-in delay-400"
    >
      Go Back Home
    </Link>
  </div>
);

export default NotFound;
