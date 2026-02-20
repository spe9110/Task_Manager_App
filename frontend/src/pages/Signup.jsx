import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRegisterUserMutation } from '../redux/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Schéma de validation avec Yup
const validationSchema = yup.object({
  username: yup.string().min(2, 'Name must be at least 2 characters').required('Required'),
  email: yup.string().email("Invalid email address").required("Required"), 
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password cannot be more than 255 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required("Required"),
  password_confirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Required"),
});

const Signup = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      navigate('/login');
    }
  }, [navigate, userData]);

  // ✅ Fonction appelée à la soumission du formulaire
  const onSubmit = async ({ username, email, password, password_confirm }) => {
    try {
      await registerUser({ username, email, password, password_confirm }).unwrap();
      //dispatch(setCredentials({ ...res }));
      reset(); // Réinitialiser le formulaire après l'inscription réussie
      toast.success('User registered successfully! Login now.');
      navigate('/login');
    } catch (err) {
      console.error(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="
      relative w-full min-h-screen
      flex items-center justify-center
      px-3
      xs:px-4
      sm:px-6
      md:px-10
      lg:px-16
      bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50
      overflow-hidden
    ">

      {/* Background Blur Effects */}
      <div className="absolute -top-32 -left-32 w-64 h-64 xs:w-72 xs:h-72 md:w-96 md:h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 md:w-[400px] md:h-[400px] bg-cyan-200/30 rounded-full blur-3xl"></div>

      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="
          absolute top-3 sm:top-4 left-4
          xs:left-6
          text-lg
          xs:text-xl
          sm:text-2xl
          md:text-3xl
          font-extrabold text-blue-500 cursor-pointer
        "
      >
        Taskly
      </h1>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-[320px] xs:max-w-sm sm:max-w-md md:max-w-lg p-5 xs:p-6 sm:p-8 md:p-10 bg-white/70 backdrop-blur-xl
        shadow-xl rounded-2xl border border-white/40 mt-8">

        <div className="text-center mb-5">
          <h2 className="
            text-lg
            xs:text-xl
            sm:text-2xl
            font-bold text-gray-800
          ">
            Create Account
          </h2>

          <p className="text-xs xs:text-sm text-gray-600 mt-1">
            Please fill the form below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              className="
                w-full rounded-lg
                px-3 py-2
                xs:px-4 xs:py-3
                text-sm xs:text-base
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
              {...register("username")}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="
                w-full rounded-lg
                px-3 py-2
                xs:px-4 xs:py-3
                text-sm xs:text-base
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="
                w-full rounded-lg
                px-3 py-2
                xs:px-4 xs:py-3
                text-sm xs:text-base
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="
                w-full rounded-lg
                px-3 py-2
                xs:px-4 xs:py-3
                text-sm xs:text-base
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
              {...register("password_confirm")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 lg:top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password_confirm && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password_confirm.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="
              w-full
              py-2
              xs:py-3
              text-sm xs:text-base
              bg-gradient-to-r from-blue-500 to-cyan-400
              text-white font-semibold
              rounded-lg
              hover:scale-[1.02]
              transition
            "
          >
            {isSubmitting || isLoading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="
          mt-5
          text-xs
          xs:text-sm
          text-center text-gray-600
        ">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );

}

export default Signup

/*
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRegisterUserMutation } from '../redux/userApiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Schéma de validation avec Yup
const validationSchema = yup.object({
  username: yup.string().min(2, 'Name must be at least 2 characters').required('Required'),
  email: yup.string().email("Invalid email address").required("Required"), 
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password cannot be more than 255 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required("Required"),
  password_confirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required("Required"),
});

const Signup = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      navigate('/login');
    }
  }, [navigate, userData]);

  // ✅ Fonction appelée à la soumission du formulaire
  const onSubmit = async ({ username, email, password, password_confirm }) => {
    try {
      await registerUser({ username, email, password, password_confirm }).unwrap();
      //dispatch(setCredentials({ ...res }));
      reset(); // Réinitialiser le formulaire après l'inscription réussie
      toast.success('User registered successfully! Login now.');
      navigate('/login');
    } catch (err) {
      console.error(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className='absolute top-2 left-6'>
            <h1
            onClick={() => navigate("/")}
            className="absolute top-2 left-6 xs:left-8 sm:left-10 text-xl xs:text-2xl sm:text-3xl font-extrabold 
        text-blue-500 cursor-pointer hover:text-blue-600 transition">
            Taskly
            </h1>
        </div>
      <div className="w-[400px] p-10 bg-white shadow rounded-3xl border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Welcome to Taskly</h2>
          <p className="text-sm text-gray-600">Please create an account using the form below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className={`w-full rounded-md px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              {...register('username')}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className={`w-full rounded-md px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`w-full rounded-md px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="relative">
            <input
              id="password_confirm"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`w-full rounded-md px-3 py-2 border ${errors.password_confirm ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password_confirm')}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.password_confirm.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 cursor-pointer"
            >
              {isSubmitting || isLoading ? 'Loading...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="mt-5 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 underline hover:text-blue-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup

*/