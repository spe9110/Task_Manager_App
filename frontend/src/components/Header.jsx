import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation, useSendOtpVerificationMutation } from "../redux/userApiSlice";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const dropdownRef = useRef();

  const [logoutUser] = useLogoutUserMutation();
  const [sendOtpVerification, { isLoading }] =
    useSendOtpVerificationMutation();

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      console.error(error);
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtpVerification().unwrap();
      toast.success("OTP sent successfully!");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  // Account verification
  useEffect(() => {
    if (userData?.isAccountVerified) {
      setIsVerified(true);
    }
  }, [userData]);

  // Lock body scroll (mobile menu)
  useEffect(() => {
    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <header className="bg-black text-white fixed top-0 left-0 w-full h-20 z-50 shadow-md">
      <div className="flex justify-between items-center h-full px-4 sm:px-8 lg:px-16">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl sm:text-3xl font-extrabold text-blue-400 cursor-pointer hover:text-blue-300 transition"
        >
          Taskly
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {userData ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2"
              >
                {userData?.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={24} />
                )}
                <span className="capitalize">
                  {userData.username}
                </span>
              </button>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                  {!isVerified && (
                    <button
                      onClick={handleSendOtp}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                    >
                      <FaEnvelope />
                      Verify Email
                    </button>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 gap-2"
                  >
                    <FaUserCircle />
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 gap-2"
                  >
                    <PiSignOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpenMobile(true)}
        >
          <GiHamburgerMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {openMobile && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
              openMobile ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setOpenMobile(false)}
          ></div>

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-[60%] bg-black text-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
              openMobile ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-3xl"
              onClick={() => setOpenMobile(false)}
            >
              <IoClose />
            </button>

            <div className="flex flex-col h-full justify-start px-2 py-20 text-base">

              {userData ? (
                <div className="flex flex-col justify-start gap-4">
                                     {/* User Info */}
                    <div className="flex items-center gap-4">
                      {userData?.avatar ? (
                        <img
                          src={userData.avatar}
                          alt="avatar"
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-500/40"
                        />
                      ) : (
                        <FaUserCircle size={42} className="text-neutral-400" />
                      )}

                      <div className="flex flex-col">
                        <span className="text-lg font-semibold capitalize">
                          {userData?.username || "User"}
                        </span>
                        <span className="text-sm text-neutral-400 truncate max-w-[200px]">
                          {userData?.email}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-neutral-700" />


                  {/* Verify Email */}
                  {!isVerified && (
                    <button
                      onClick={handleSendOtp}
                      className="flex justify-start items-center gap-3 px-4 py-3 rounded-lg 
                    hover:bg-white/10 transition-all duration-200"
                    >
                      <MdOutlineMail className="text-xl text-blue-400" />
                      <span className="font-medium">Verify Email</span>
                    </button>
                  )}

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setOpenMobile(false)}
                    className="flex justify-start items-center gap-3 px-4 py-3 rounded-lg 
                    hover:bg-white/10 transition-all duration-200"
                  >
                    <CgProfile className="text-xl text-blue-400" />
                    <span className="font-medium">Profile</span>
                  </Link>

                  {/* Divider */}
                  <div className="absolute bottom-[10%] h-px bg-neutral-700"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpenMobile(false);
                    }}
                    className="absolute bottom-4 flex items-center gap-2 py-2 px-4 rounded-lg bg-red-400 hover:bg-red-500 transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>

              ) : (

                <div className="w-full">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpenMobile(false);
                    }}
                    className="w-full flex items-center justify-center gap-3
                    bg-gradient-to-r from-blue-500 to-cyan-400
                    px-6 py-3 rounded-full font-semibold
                    hover:scale-[1.02] transition duration-300"
                  >
                    <CgProfile className="text-lg" />
                    Login
                  </button>
                </div>

              )}
            </div>

          </div>
        </>
      )}

    </header>
  );
};

export default Header;


/*
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation, useSendOtpVerificationMutation } from "../redux/userApiSlice";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const [openMobile, setOpenMobile] = useState(false);
  // const { data: userData } = useFetchCurrentUserQuery();
  const [isVerified, setIsVerified] = useState(false);

  const [logoutUser] = useLogoutUserMutation();
  const [ sendOtpVerification, { isLoading } ] = useSendOtpVerificationMutation();

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/login");
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Send OTP Verification
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtpVerification().unwrap();
      toast.success("OTP sent successfully!");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleToggleMobile = () => {
    setOpenMobile(!openMobile);
  };
  // Check verification on mount
  useEffect(() => {
    const checkVerification = async () => {
      if (!userData) return;

      // fallback to Redux
      if (userData.isAccountVerified) {
        setIsVerified(true);
        return;
      }
    };

    checkVerification();
  }, [userData]);

  // this effect handles the body overflow when the mobile menu is open
// It prevents scrolling when the mobile menu is open
    useEffect(() => {
      if (openMobile) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }

      // Cleanup in case the component unmounts
      return () => {
          document.body.style.overflow = '';
      };
    }, [openMobile]);

  if(isLoading) {
    return <div>Loading...</div>
  }

  return (
    <header className="bg-black text-white shadow-md fixed w-full h-20 top-0 left-0 z-50 lg:flex justify-between items-center lg:px-[64px]">
      <h1
            onClick={() => navigate("/")}
            className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
          >
            Taskly
      </h1>
      {userData ? (
        <div className="relative group">
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold cursor-pointer">
              {userData?.avatar ? (
                <div className="inline-flex justify-center items-center gap-x-2">
                  <img src={userData?.avatar} className="w-[40px] h-[40px] rounded-full object-cover object-center" width={40} height={40} alt="avatar" />
                  <span className="capitalize">{userData.username}</span>
                </div>
              ) : (
                <FaUserCircle className="text-gray-300" size={22} />
              )}

              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
            <div className="absolute hidden group-hover:block top-full right-0 mt-[-6] bg-slate-50 text-black rounded shadow-lg border w-44">
                <ul className="text-sm">

                  {!isVerified && <li
                      onClick={handleSendOtp}
                      className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2"
                    >
                      <FaEnvelope size={18} />
                      <span>Verify Email</span>
                    </li>}
                  
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2"
                  >
                    <FaUserCircle size={18} />
                    <span>Profile</span>
                  </Link>

                  <li
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2"
                  >
                    <PiSignOut size={18} />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
          </div>
      ) : (
        <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 xs:px-5 sm:px-6 py-2 rounded-full text-xs xs:text-sm sm:text-base transition duration-300"
            >
              Login
        </button>        
      )}
    </header>
  );
};

export default Header;
*/