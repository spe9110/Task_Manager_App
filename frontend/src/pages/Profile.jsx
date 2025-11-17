import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../Util";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);

  // Local state for freshly fetched profile
  const [profile, setProfile] = useState(userData);
  const [loading, setLoading] = useState(true);

  const avatar = profile?.avatar || "/default-avatar.png";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData) return;

      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/users/current?ts=${Date.now()}`,
          { withCredentials: true }
        );

        setProfile(data.result || userData);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        // fallback to redux userData
        setProfile(userData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-xl text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center gap-3 px-6 py-[24px]">
      <h3 className="text-3xl font-bold mt-10">Profile</h3>

      {/* Avatar */}
      <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden border-2 border-slate-400 shadow-md hover:shadow-lg transition cursor-pointer">
        <img
          src={avatar}
          alt={`${profile?.username || "User"} avatar`}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Username */}
      <p className="font-bold text-2xl capitalize text-gray-800">
        {profile?.username || "Unnamed User"}
      </p>

      {/* Email */}
      <p className="text-gray-600 text-lg">{profile?.email}</p>

      {/* Verified Status */}
      <p
        className={`px-4 py-1 rounded-full text-sm font-semibold ${
          profile?.isAccountVerified
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {profile?.isAccountVerified ? "Verified Account" : "Not Verified"}
      </p>

      {/* Edit Button */}
      <button className="border border-slate-400 w-[200px] py-[8px] rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
        Edit profile
      </button>
    </div>
  );
};

export default Profile;

/*
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../Util";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);
  const [profile, isProfile ] = useState([])
  const avatar = userData?.avatar || "/default-avatar.png"; // fallback image
  
  useEffect(()=>{
    const checkVerification = async () => {
      if (!userData) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/users/current?ts=${Date.now()}`,
          { withCredentials: true }
        );
        isProfile(res.data.result);
      } catch (err) {
        console.error(err);
      }
    };

    checkVerification();
  },[userData])
  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-center items-center gap-6 px-6 py-[24px]">
    <h3 className="text-3xl font-bold mt-8">Profile</h3>      
 
      <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] rounded-full overflow-hidden border-2 border-slate-400 cursor-pointer">
        <img
          src={avatar}
          alt={`${userData?.username || "User"} avatar`}
          className="w-full h-full object-cover object-center"
        />
      </div>

      
      <p className="font-bold text-2xl capitalize text-gray-800">
        {userData?.username || "Unnamed User"}
      </p>

      
      <button className="border border-slate-400 w-[200px] py-[8px] rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
        Edit profile
      </button>
    </div>
  );
};

export default Profile
*/