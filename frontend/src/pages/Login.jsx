import { useEffect, useState, useRef } from 'react';
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
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (userData && !hasNavigated.current) {
      hasNavigated.current = true;
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
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className='absolute top-8 left-24'>
            {/* 🔷 Logo */}
            <h1
            onClick={() => navigate("/")}
            className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-400 cursor-pointer hover:text-blue-300 transition duration-300"
            >
            Taskly
            </h1>
        </div>
      <div className="w-[400px] p-10 bg-white shadow rounded-3xl border border-gray-200">
        <div className="text-center mb-6">
          {/* <img src={wawakuLogo} alt="wawaku law firm logo" className='w-14 h-14 rounded-full border-2 border-orange-500 mx-auto mb-2' /> */}
          <h2 className="text-xl font-bold">Welcome to Taskly</h2>
          <p className="text-sm text-gray-600">Please sign in using the form below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
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

          {/* Password */}
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

          {/* Submit */}
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
