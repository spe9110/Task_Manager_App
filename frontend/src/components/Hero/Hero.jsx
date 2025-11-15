import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <section className="hero_container relative w-full h-[600px] flex flex-col items-center justify-start z-0 text-white overflow-hidden">
        <div className="hero_bg_gradient absolute w-full h-full opacity-80 bg-gradient-to-r from-cyan-500 to-blue-50"></div>
        <div className='hero_content absolute w-full h-full bottom-20 px-[100px] flex flex-col justify-end items-start'>
            <h1
              className="
                hero_title 
                text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                font-bold text-start text-pink-700 leading-tight tracking-tight
              "
            >
              Make your perfect <br /> day
            </h1>

            <h3
              className="
                hero_description 
                mt-4 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 
                text-start text-gray-50 max-w-2xl leading-relaxed
              "
            >
              Taskly will help you manage your day and to-do list. <br />
              We have a wide range of features to help you get things done
            </h3>

            <button
              className="
                hero_started_btn 
                mt-8 px-6 py-3 xs:px-8 xs:py-4 sm:px-10 sm:py-4 
                bg-blue-500 hover:bg-blue-600 text-white font-medium 
                rounded-full text-sm xs:text-base sm:text-lg transition duration-300
              "
            >
              Let's get Started...
            </button>

        </div>
    </section>
  )
}

export default Hero
