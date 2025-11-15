import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center py-4 px-4 xs:px-6 sm:px-10 md:px-12 lg:px-20">
        
        {/* 🔷 Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
        >
          Taskly
        </h1>

        {/* 🔐 Sign In Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 xs:px-5 sm:px-6 py-2 rounded-full text-xs xs:text-sm sm:text-base transition duration-300"
        >
          Sign in
        </button>
      </div>
    </header>
  );
};

export default Header;
