import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);

  const avatar = userData?.avatar || "/default-avatar.png"; // fallback image

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center gap-6 px-6 py-[24px]">
    <h3 className="text-3xl font-bold my-4">Profile</h3>      
      {/* Avatar Container */}
      <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden border-2 border-slate-400 cursor-pointer">
        <img
          src={avatar}
          alt={`${userData?.username || "User"} avatar`}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Username */}
      <p className="font-bold text-2xl capitalize text-gray-800">
        {userData?.username || "Unnamed User"}
      </p>

      {/* Edit Button */}
      <button className="border border-slate-400 w-[200px] py-[8px] rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
        Edit profile
      </button>
    </div>
  );
};

export default Profile
