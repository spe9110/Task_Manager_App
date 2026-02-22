import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../redux/userApiSlice";
import { setCredentials } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ✅ Validation schema
const validationSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Must include uppercase, lowercase, number & special character"
    )
    .required("Required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      navigate("/", { replace: true });
    }
  }, [userData, navigate]);

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Login successful!");
      reset();
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20
bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 overflow-hidden">

      {/* Background decorative */}
      <div aria-hidden="true"
        className="absolute -top-32 -left-32 w-[300px] h-[300px] 
        bg-blue-300/30 rounded-full blur-3xl">
      </div>

      <div aria-hidden="true"
        className="absolute bottom-0 right-0 w-[400px] h-[400px] 
        bg-cyan-200/30 rounded-full blur-3xl">
      </div>
      {/* 🔷 Logo */}
      <Link
        to="/"
        className="absolute top-3 sm:top-4 left-6 xs:left-8 sm:left-10 
        text-xl xs:text-2xl sm:text-3xl font-extrabold 
        text-blue-700 hover:text-blue-800 transition
        focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        Taskly
      </Link>

      {/* 🧊 Login Card */}
      <div className="relative mt-8 z-10 w-full 
        max-w-sm xs:max-w-md md:max-w-lg
        p-6 xs:p-8 sm:p-10
        bg-white/70 backdrop-blur-xl 
        shadow-xl rounded-3xl border border-white/40">

        <div className="text-center mb-6">
          <h2 className="text-xl xs:text-2xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

          {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="spencer@hotmail.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full rounded-lg px-4 py-3 border text-sm xs:text-base
            focus:outline-none focus:ring-2 focus:ring-blue-600
            ${errors.email ? "border-red-600" : "border-gray-300"}`}
            {...register("email")}
          />

          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Wax123@"
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`w-full rounded-lg px-4 py-3 border text-sm xs:text-base
              focus:outline-none focus:ring-2 focus:ring-blue-600
              ${errors.password ? "border-red-600" : "border-gray-300"}`}
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2
              text-gray-600 hover:text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}

            <div className="text-right mt-2">
              <Link
                to="/reset-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 
            text-white font-semibold rounded-lg 
            hover:scale-[1.02] hover:shadow-lg transition duration-300"
          >
            {isSubmitting || isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


/*
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from '../redux/userApiSlice';
import { setCredentials } from '../redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// ✅ Validation schema
const validationSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Required"),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(255, 'Password cannot be more than 255 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required("Required"),
});

const Login = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userData) {
      // Redirect only if user is already authenticated
      navigate('/', { replace: true });
    }
  }, [userData, navigate]);

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      //setCredentials must be a spread operator ...res to display user otherwise it will display an unknown user
      dispatch(setCredentials({ ...res }));
      toast.success('Login successful!');
      reset();
      navigate("/", { replace: true });  // Only on success
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
      console.error(err?.data?.message || err?.error);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className='absolute top-8 left-24'>
            <h1
            onClick={() => navigate("/")}
            className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
            >
            Taskly
            </h1>
        </div>
      <div className="w-[400px] p-10 bg-white shadow rounded-3xl border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Welcome to Taskly</h2>
          <p className="text-sm text-gray-600">Please sign in using the form below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="text-right mt-1">
                <Link
                to="/reset-password"
                className="text-sm text-blue-500 hover:underline"
                >
                Forgot password?
                </Link>
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`w-full rounded-md px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              {...register('password')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 translate-y-1/4  text-gray-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 cursor-pointer"
            >
              {isSubmitting || isLoading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-5 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 underline hover:text-blue-600">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
*/