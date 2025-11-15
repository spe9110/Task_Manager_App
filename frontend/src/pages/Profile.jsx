import React from 'react'

const Profile = (props) => {
  return (
    <div>
        <h1 className="font-bold text-blue-400 tracking-tight
                     text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
        Hello, {props.name}
      </h1>
    </div>
  )
}

export default Profile
