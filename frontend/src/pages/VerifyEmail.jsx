import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerifyEmailUserMutation } from '../redux/userApiSlice'
import { setCredentials } from '../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputRefs = useRef([]);

  const [verifyEmailUser, { isLoading }] = useVerifyEmailUserMutation();

  // Autofill next input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Paste: fill all inputs automatically
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().slice(0, 6);
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // ✅ FIXED RESET FUNCTION
  const resetInputs = () => {
    inputRefs.current.forEach((el) => {
      if (el) el.value = '';
    });
    inputRefs.current[0].focus();
  };


    // Redirect if already verified
    useEffect(() => {
      // optional: redirect if verified
      if (userData?.isAccountVerified) {
          toast.success('Email verified successfully!');
      }
    }, [userData]);
        
      // Handle OTP form submission
      const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
          const otpArray = inputRefs.current.map(el => el.value.trim());
          const otp = otpArray.join('');
          const res = await verifyEmailUser({ otp }).unwrap();

          // Incoming backend userData
          const newUserData = res.userData;
          // Update Redux with the new user object
          // Merge with existing userData so avatar & username remain intact
          dispatch(
            setCredentials({
              ...userData,
              ...newUserData, // this has the updated isAccountVerified
            })
          );
          toast.success('Email verified successfully!');         
          navigate('/');
      } catch (err) {
        console.error(err?.data?.message || err.error);
        toast.error(err?.data?.message || err.error);
        resetInputs();
      }
    };
    
  return (
    <div className="relative flex items-center justify-center h-screen px-6 sm:px-0 bg-slate-100 z-50 top-0">
      <div className='absolute top-8 left-24'>
        <h1
          onClick={() => navigate("/")}
          className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
        >
          Taskly
        </h1>
      </div>

      <form onSubmit={onSubmitHandler} className='bg-slate-950 p-8 rounded-lg shadow-lg w-[450px] text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email verify OTP</h1>
        <p className='text-center mb-6 text-cyan-400'>Enter the 6-digit code sent to your email</p>

        <div
          onPaste={handlePaste}
          className="flex items-center justify-between mb-8 w-full space-x-1"
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 text-white text-center text-xl font-semibold rounded-md shadow-inner border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-150"
                type="text"
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-2 rounded-md hover:from-cyan-500 hover:to-blue-700 transition duration-200 cursor-pointer mt-4"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
