import { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation, useSendOtpVerificationMutation } from "../redux/userApiSlice";
import { logout } from "../redux/authSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../Util";

/* Icons */
import { FaUserCircle, FaEnvelope } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);

  const [isVerified, setIsVerified] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [logoutUser] = useLogoutUserMutation();
  const [sendOtpVerification] = useSendOtpVerificationMutation();

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
  const handleSendOtp = async () => {
    try {
      await sendOtpVerification().unwrap();
      toast.success("OTP sent successfully!");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  // Check verification on mount
  useEffect(() => {
    const checkVerification = async () => {
      if (!userData) return;

      if (userData.isAccountVerified) {
        setIsVerified(true);
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/users/current?ts=${Date.now()}`,
          { withCredentials: true }
        );
        setIsVerified(res.data.isAccountVerified ?? false);
      } catch (err) {
        console.error(err);
      }
    };

    checkVerification();
  }, [userData]);

  return (
    <header className="bg-black text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center py-4 px-4 xs:px-6 sm:px-10 md:px-12 lg:px-20">

        {/* 🔷 LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
        >
          Taskly
        </h1>

        {/* ⭐ If not logged in — Show Sign In */}
        {!userData && (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 xs:px-5 sm:px-6 py-2 rounded-full text-xs xs:text-sm sm:text-base transition duration-300"
          >
            Sign in
          </button>
        )}

        {/* ⭐ If logged in — User Dropdown */}
        {userData && (
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold cursor-pointer">
              {userData?.username ? (
                <div className="inline-flex items-center gap-x-2">
                  <img src={userData?.avatar} className="rounded-full object-cover object-center" width={40} height={40} alt="avatar" />
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

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-[-6] bg-slate-50 text-black rounded shadow-lg border w-44">
                <ul className="text-sm py-2">

                  {/* Show Verify Email only if not verified */}
                  {!isVerified && (
                    <li
                      onClick={handleSendOtp}
                      className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2"
                    >
                      <FaEnvelope size={16} />
                      <span>Verify Email</span>
                    </li>
                  )}

                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-200 cursor-pointer gap-2"
                  >
                    <FaUserCircle size={16} />
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
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
