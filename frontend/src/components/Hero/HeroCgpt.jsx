import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-[#e3f2fd] via-[#f8faff] to-[#f0f7ff] overflow-hidden text-gray-900">

      {/* 🌥️ Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 blur-[1px]"></div>

      {/* 🫧 Blurred Gradient Shapes */}
      <div className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-200 opacity-40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-pink-100 opacity-30 rounded-full blur-3xl"></div>

      {/* 🌟 Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center mt-8 px-6 xs:px-8 sm:px-10 md:px-16 lg:px-20 max-w-6xl"
      >
        <h1 className="font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#3b82f6] to-[#06b6d4]
          text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
          Organize Your Day <br className="hidden sm:block" />
          Like a Pro
        </h1>

        <p className="mt-6 text-gray-700 max-w-2xl 
          text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed">
          Taskly helps you plan, track, and achieve more — calmly and clearly.
          Your daily goals, simplified and beautifully managed.
        </p>

        <div className="mt-10 flex flex-col xs:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 xs:px-8 py-3 xs:py-4 bg-gradient-to-r from-blue-500 to-cyan-400 
            text-white font-semibold rounded-full shadow-md 
            hover:shadow-blue-300/40 hover:scale-105 transition duration-300"
          >
            Let's Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

/*
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f2fd] via-[#f8faff] to-[#f0f7ff] overflow-hidden text-gray-900">
      //  🌥️ Soft Background Texture or Image Overlay 
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 blur-[1px]"></div>

      //  🫧 Subtle Blurred Shapes 
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-200 opacity-40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-100 opacity-30 rounded-full blur-3xl"></div>

      //  🌟 Hero Content
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 md:px-20"
      >
        <h1 className="font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] via-[#3b82f6] to-[#06b6d4] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          Organize Your Day <br /> Like a Pro
        </h1>

        <p className="mt-6 text-gray-700 max-w-2xl text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed">
          Taskly helps you plan, track, and achieve more — calmly and clearly.  
          Your daily goals, simplified and beautifully managed.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate("/tasks")} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-full shadow-md hover:shadow-blue-300/40 hover:scale-105 transition duration-300">
            Let's get Started...
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
*/