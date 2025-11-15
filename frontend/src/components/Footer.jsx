import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // 🧠 Get current year dynamically

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto flex flex-col items-center justify-center py-6 px-4">
        <h1 className="text-center text-sm sm:text-base md:text-lg font-medium tracking-wide">
          © {currentYear} <span className="text-blue-400 font-semibold">Taskly</span>. All rights reserved.
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
