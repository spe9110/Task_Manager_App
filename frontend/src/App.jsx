import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";

// ✅ Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CreateTask = lazy(() => import("./pages/CreateTask"));
const Tasks = lazy(() => import("./pages/Tasks"));
const SingleTask = lazy(() => import("./pages/SingleTask"));
const UpdateTask = lazy(() => import("./pages/UpdateTask"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const Loader = lazy(() => import("./components/Loader"));


function App() {
  return (
    <>
      {/* ✅ Suspense wrapper */}
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            theme="colored"
          />

          <Routes>
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route element={<PrivateRoute />}>
                <Route path="tasks" element={<Tasks />} />
                <Route path="create-task" element={<CreateTask />} />
                <Route path="single-task/:id" element={<SingleTask />} />
                <Route path="update-task/:id" element={<UpdateTask />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default App;

/*
import { lazy, Suspense } from "react";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary"
import VerifyEmail from "./pages/VerifyEmail"
import ResetPassword from "./pages/ResetPassword"
import CreateTask from "./pages/CreateTask"
import Tasks from "./pages/Tasks"
import SingleTask from "./pages/SingleTask"
import UpdateTask from "./pages/UpdateTask"
import Unauthorized from "./pages/Unauthorized"


function App() {

  return (
    <div>
      <ErrorBoundary>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick theme="colored" />
        <Routes>
          <Route path="verify-email" element={<VerifyEmail/>} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Layout />}> 
            <Route index element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="tasks" element={<Tasks/>} />
              <Route path="create-task" element={<CreateTask/>} />
              <Route path="single-task/:id" element={<SingleTask/>} />
              <Route path="update-task/:id" element={<UpdateTask/>} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
*/
// npm create vite@latest
// npm install -D tailwindcss@3 postcss autoprefixer
// npx tailwindcss init -p
// npm i react-router-dom@
// npm i react-icons
// npm i react-toastify
// npm i react-error-boundary
// npm i @reduxjs/toolkit react-redux
// npm install react-intersection-observer
// npm i axios
// npm install react-slick --save
// npm install slick-carousel --save
// npm i react-hook-form @hookform/resolvers yup
// npm i react-phone-number-input
// npm i react-datepicker
// npm install --save @sentry/react
// npm i @tanstack/react-query