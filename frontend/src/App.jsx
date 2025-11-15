import Home from "./pages/Home"
import Profile from "./pages/Profile"
import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}> 
          <Route index element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
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