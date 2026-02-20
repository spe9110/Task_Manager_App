import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { MdEdit, MdDelete } from "react-icons/md";
import UpdateProfile from "../components/UpdateProfile";
import DeleteAccount from "../components/DeleteAccount";
import { useFetchCurrentUserQuery } from "../redux/userApiSlice";

Modal.setAppElement("#root");

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);

  // --- Fetch fresh data: SINGLE SOURCE OF TRUTH ---
  const {
    data: response,
    isLoading: fetching,
    isError,
    error,
  } = useFetchCurrentUserQuery();

  const profile = response; // <--- RTK Query gives you accurate user data

  // Modal state
    const [ showModalProfile, setShowModalProfile ] = useState(false);
    const [modalType, setModalType] = useState(null);

  //modal for user profile 
  const handleShowModalProfile = useCallback(() => {
    setShowModalProfile(!showModalProfile);
    setModalType("update");
  }, [showModalProfile]);

  const handleShowDeleteModal = useCallback(() => {
    setShowModalProfile(!showModalProfile);
    setModalType("delete");
  }, [showModalProfile]);
  
  const handleCloseModal = useCallback(() => {
    setModalType(null);
  }, []);

const customStyles = {
  overlay: {
    position: "fixed",
    inset: 0, // FULL SCREEN (important)
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",                // modern centering
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",                // mobile safe spacing
    zIndex: 1000,
  },
  content: {
    position: "relative",
    inset: "auto",
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    width: "100%",
    maxWidth: "500px",              // desktop limit
  },
};

  // Loading UI
  if (fetching) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-xl text-gray-500">
        Loading profile...
      </div>
    );
  }

  // Error UI
  if (isError) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-xl text-red-500">
        Failed to load profile: {error?.data?.message || "Unknown error"}
      </div>
    );
  }
  return (
    <div className="
      w-full min-h-screen
      flex flex-col items-center
      px-4
      xs:px-6
      sm:px-8
      md:px-12
      lg:px-20
      py-12
      bg-gradient-to-br from-slate-50 via-white to-blue-50
    ">

      {/* Title */}
      <h3 className="
        text-2xl
        xs:text-3xl
        sm:text-4xl
        font-bold
        mb-8
        text-gray-800
      ">
        Profile
      </h3>

      {/* Profile Card */}
      <div className="
        w-full
        max-w-[320px]
        xs:max-w-sm
        sm:max-w-md
        md:max-w-lg
        bg-white
        shadow-lg
        rounded-2xl
        border border-gray-200
        p-6
        xs:p-8
        flex flex-col items-center
        gap-5
      ">

        {/* Avatar */}
        <div className="
          w-[90px] h-[90px]
          xs:w-[110px] xs:h-[110px]
          sm:w-[140px] sm:h-[140px]
          md:w-[160px] md:h-[160px]
          lg:w-[200px] lg:h-[200px]
          rounded-full overflow-hidden
          border-2 border-slate-300
          shadow-md hover:shadow-xl
          transition
          cursor-pointer
        ">
          <img
            src={profile?.avatar}
            alt={`${profile?.username || "User"} avatar`}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Username */}
        <p className="
          font-bold
          text-xl
          xs:text-2xl
          sm:text-3xl
          capitalize
          text-gray-800
        ">
          {profile?.username || "Unnamed User"}
        </p>

        {/* Email */}
        <p className="
          text-gray-600
          text-sm
          xs:text-base
          sm:text-lg
          break-all
          text-center
        ">
          {profile?.email}
        </p>

        {/* Verification Badge */}
        <p
          className={`
            px-4 py-1
            rounded-full
            text-xs xs:text-sm
            font-semibold
            ${
              profile?.isAccountVerified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {profile?.isAccountVerified
            ? "Verified Account"
            : "Not Verified"}
        </p>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 mt-4">
          <button
            onClick={handleShowModalProfile}
            className="
              w-full xs:w-auto
              flex items-center justify-center gap-2
              px-4 py-2
              rounded-lg
              border border-slate-300
              bg-slate-100
              hover:bg-slate-200
              text-slate-800
              font-semibold
              transition
            "
          >
            <MdEdit size={20} />
            Edit Profile
          </button>

          <button
            onClick={handleShowDeleteModal}
            className="
              w-full xs:w-auto
              flex items-center justify-center gap-2
              px-4 py-2
              rounded-lg
              border border-red-300
              bg-red-100
              hover:bg-red-200
              text-red-700
              font-semibold
              transition
            "
          >
            <MdDelete size={20} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalType === "update"}
        onRequestClose={handleCloseModal}
        style={customStyles}
      >
        <UpdateProfile onClose={handleCloseModal} />
      </Modal>

      <Modal
        isOpen={modalType === "delete"}
        onRequestClose={handleCloseModal}
        style={customStyles}
      >
        <DeleteAccount
          id={userData?.id}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );

};

export default Profile;

/*


return (
  <div className="w-full min-h-[100vh] bg-white flex flex-col justify-center items-center gap-3 px-6 py-[24px]">
    <h3 className="text-3xl font-bold mt-10">Profile</h3>


    <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden border-2 border-slate-400 shadow-md hover:shadow-lg transition cursor-pointer">
      <img
        src={profile?.avatar}
        alt={`${profile?.username || "User"} avatar`}
        className="w-full h-full object-cover object-center"
      />
    </div>


    <p className="font-bold text-2xl capitalize text-gray-800">
      {profile?.username || "Unnamed User"}
    </p>


    <p className="text-gray-600 text-lg">{profile?.email}</p>

    <p
      className={`px-4 py-1 rounded-full text-sm font-semibold ${
        profile?.isAccountVerified
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {profile?.isAccountVerified ? "Verified Account" : "Not Verified"}
    </p>


    <div className="flex flex-row justify-center items-center gap-4">
      <button onClick={handleShowModalProfile} className="flex items-center justify-center gap-2 border border-slate-400 py-[8px] px-[16px] rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
        <MdEdit size={24}/>
        <span className='font-semibold'>Edit Profile</span>
      </button>
      <button onClick={handleShowDeleteModal} className="flex items-center justify-center gap-2 border border-red-300 py-[8px] px-[16px] rounded-md bg-red-200 hover:bg-red-300 text-red-800 transition">
        <MdDelete size={24}/>
        <span className='font-semibold'>Delete account</span>
      </button>
    </div>
    <Modal isOpen={modalType === "update"} onRequestClose={handleCloseModal} style={customStyles}>
      <UpdateProfile onClose={handleCloseModal}/>
    </Modal>
    <Modal isOpen={modalType === "delete"} onRequestClose={handleCloseModal} style={customStyles}>
      <DeleteAccount id={userData?.id} onClose={handleCloseModal} />
    </Modal>
  </div>
);
*/


/*
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdEdit, MdDelete } from "react-icons/md";
import { API_BASE_URL } from "../../Util";
import Modal from 'react-modal';
import UpdateProfile from "../components/UpdateProfile";
import DeleteAccount from "../components/DeleteAccount";

Modal.setAppElement('#root'); // Add this line

const Profile = () => {
  const { userData } = useSelector((state) => state.auth);

  const [ showModalProfile, setShowModalProfile ] = useState(false);
  const [modalType, setModalType] = useState(null);
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
        console.log("profile data");
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

   //modal for user profile 
  const handleShowModalProfile = useCallback(() => {
    console.log("Modal Profile", !showModalProfile);
    setShowModalProfile(!showModalProfile);
    setModalType("update");
  }, [showModalProfile]);

  const handleShowDeleteModal = useCallback(() => {
    setShowModalProfile(!showModalProfile);
    setModalType("delete");
  }, []);
  const handleCloseModal = useCallback(() => {
    setModalType(null);
  }, []);

  const customStyles = {
    overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
    zIndex: 1000, // optional: ensure it's on top
    backdropFilter: 'blur(5px)', // This blurs what's behind the overlay
    WebkitBackdropFilter: 'blur(5px)', // For Safari support
  },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
};

const customDeleteStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
    zIndex: 1000, // optional: ensure it's on top
    backdropFilter: 'blur(5px)', // This blurs what's behind the overlay
    WebkitBackdropFilter: 'blur(5px)', // For Safari support
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
};
  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-xl text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100vh] bg-white flex flex-col justify-center items-center gap-3 px-6 py-[24px]">
      <h3 className="text-3xl font-bold mt-10">Profile</h3>


      <div className="w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden border-2 border-slate-400 shadow-md hover:shadow-lg transition cursor-pointer">
        <img
          src={avatar}
          alt={`${profile?.username || "User"} avatar`}
          className="w-full h-full object-cover object-center"
        />
      </div>


      <p className="font-bold text-2xl capitalize text-gray-800">
        {profile?.username || "Unnamed User"}
      </p>


      <p className="text-gray-600 text-lg">{profile?.email}</p>

      <p
        className={`px-4 py-1 rounded-full text-sm font-semibold ${
          profile?.isAccountVerified
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {profile?.isAccountVerified ? "Verified Account" : "Not Verified"}
      </p>


      <div className="flex flex-row justify-center items-center gap-4">
        <button onClick={handleShowModalProfile} className="flex items-center justify-center gap-2 border border-slate-400 w-[200px] py-[8px] rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 transition">
          <MdEdit size={24}/>
          <span className='font-semibold'>Edit Profile</span>
        </button>
        <button onClick={handleShowDeleteModal} className="flex items-center justify-center gap-2 border border-red-300 py-[8px] px-[16px] rounded-md bg-red-200 hover:bg-red-300 text-red-800 transition">
          <MdDelete size={24}/>
          <span className='font-semibold'>Delete account</span>
        </button>
      </div>
      <Modal isOpen={modalType === "update"} onRequestClose={handleCloseModal} style={customStyles}>
        <UpdateProfile onClose={handleCloseModal}/>
      </Modal>
      <Modal isOpen={modalType === "delete"} onRequestClose={handleCloseModal} style={customDeleteStyles}>
        <DeleteAccount id={userData?.id} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default Profile;
*/