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
          <Route path="/" element={<Layout />}> 
            <Route index element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App

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