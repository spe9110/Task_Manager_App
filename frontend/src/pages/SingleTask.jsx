import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

const styleGoBack = {
    backgroundColor: '#d6d6d65c',       // Tailwind's bg-red-300
    borderRadius: '50%',             // Tailwind's rounded-2xl
    border: '2px solid #e2e8f0',      // Tailwind's border-2 and border-slate-200
    padding: '8px',                  // Tailwind's p-[16px]
    cursor: 'pointer',                // Tailwind's cursor-pointer
    display: 'inline-block',          // Ensure padding/border apply around the link
    textDecoration: 'none',           // Remove underline
    transition: 'background 0.2s',    // Smooth background color transition
    position: 'absolute',
    top: '100px',
    left: '64px',
    hover: {
        backgroundColor: '#6d9dcf8b'  // Tailwind's bg-red-400 on hover
    }
};

const SingleTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={styleGoBack}
        aria-label="Go back"
      >
        <IoArrowBack size={32} />
      </button>
      <h1 className="text-2xl font-bold">Single Task Page - {id}</h1>  
    </div>
  )
}

export default SingleTask