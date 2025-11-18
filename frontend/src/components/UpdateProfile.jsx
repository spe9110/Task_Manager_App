import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useUpdateUserMutation, useFetchCurrentUserQuery } from "../redux/userApiSlice";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
// Yup validation schema
const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Too short!")
    .max(20, "Too long!")
    .required("Username is required"),

  avatar: yup
    .mixed()
    .test("fileType", "Invalid file type", (value) => {
      if (!value || value.length === 0) return true; // avatar is optional
      return value[0] instanceof File;
    }),
});

const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();

  // Fetch fresh data
  const { data: response, isLoading: fetching } = useFetchCurrentUserQuery();

  // Update mutation
  const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

  // Combined user (API → fallback to Redux)
  const user = response;
  console.log('userdata :', user);
  

  // Preview avatar
  const [preview, setPreview] = useState(user?.avatar);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: user?.username || "",
      avatar: null,
    },
  });

  // Sync form when API loads
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setPreview(user.avatar);
    }
  }, [user, setValue]);

  // Watch avatar input
  const avatarFile = watch("avatar");

  // Auto preview selected avatar
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const objectUrl = URL.createObjectURL(avatarFile[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  // Submit handler
  const onSubmit = async (formData) => {
    try {
      const body = {
        username: formData.username,
      };

      const file = formData.avatar?.[0] || null;

      const res = await updateProfile({ data: body, file }).unwrap();

      // Update Redux safely
      dispatch(setCredentials(res.result));

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (fetching) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="relative bg-white w-[40vw] min-w-[340px] p-6 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className='absolute top-2 right-4 bg-transparent flex justify-end items-center w-full'>
            <button
                className="bg-transparent cursor-pointer border-1 border-slate-200 hover:bg-slate-100 p-[8px] rounded-full hover:duration-75"
                aria-label="Close modal"
                onClick={onClose}
                type="button"
            >
                <IoClose className="text-black" size={24} />
            </button>
        </div>
        {/* Avatar Preview */}
        <div className="flex justify-center">
          <img
            src={preview}
            alt="avatar"
            className="h-[110px] w-[110px] rounded-full object-cover border shadow"
          />
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Username:</label>
          <input
            id="username"
            type="text"
            {...register("username")}
            className={`mt-1 block w-full rounded-md px-3 py-1.5 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-slate-500`}
          />
          {errors.username && (
            <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
          )}
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="text-sm text-gray-700 font-medium">Avatar:</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            {...register("avatar")}
            className="mt-1 block w-full text-sm"
          />
          {errors.avatar && (
            <p className="text-xs text-red-500 mt-1">{errors.avatar.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 border border-gray-300 bg-red-100 rounded-md hover:bg-red-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || updating}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting || updating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;


/*
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setCredentials } from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation, useFetchCurrentUserQuery } from "../redux/userApiSlice";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  username: yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required("Username is required"),
 avatar: yup
    .mixed()
    .test("avatar", "You need to provide an image file", (value) => {
      if (!value.length) return true; // Allow empty value (no file selected)
      return value[0] instanceof File; // Ensure the uploaded value is a valid file
    }),
});

const UpdateProfile = () => {
    const { userData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // fetch user profile data
  const { data: [], error, isLoading } = useFetchCurrentUserQuery()
  // Mutation for updating profile
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  // React Hook Form setup
  const { register, handleSubmit, setValue, formState:{ errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
        username: userData?.username || "",
        avatar: null,
        },
    });
    // Update form values when `userInfo` changes
    useEffect(() => {
      if (userData) {
        setValue("username", userData.username);
      }
    }, [userData, setValue]);

    const onSubmit = async (formData) => {
        const { username, avatar } = formData;
            try {
                // Create a FormData object to send the file
                const data = { username };
                const file = avatar && avatar.length > 0 ? avatar[0] : null;
                // Call the mutation
                const res = await updateProfile({ data, file }).unwrap();
                dispatch(setCredentials(userData, res)); // Update user info in Redux store
                toast.success('Profile updated successfully!');
            } catch (err) {
                console.error("error while updating:", err); // Log the error for debugging
                toast.error(err?.data?.message || err.error);
        }
    };
    if (isLoading) return <div>Loading...</div>
  return (
    // wrap the component with a div to avoid the error of using a fragment
    <div className="bg-white w-[40vw] h-auto border-gray-100 p-[24px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-2"
        >
          <div className="flex items-center justify-center">
            <img
              src={userData.avatar}
              alt="avatar"
              className="h-[100px] w-[100px] object-cover rounded-full object-center shadow-md"
            />
          </div>
          <div className="input-wrapper flex flex-col">
            <div className="mt-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-500 outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm ${
                  errors.username ? "outline-red-500" : "outline-gray-300"
                }`}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-xs italic text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="input-wrapper flex flex-col">
            <div className="mt-2">
              <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                Avatar:
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="block w-[15rem] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-500 outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:text-sm"
                {...register("avatar")}
              />
            </div>
            {errors.avatar && (<p className="text-xs italic text-red-500">{errors.avatar.message}</p>)}
          </div>
            <div className="flex items-center justify-end gap-4 mt-4">        
                <button
                className="border-2 bg-transparent border-red-600 font-semibold px-[16px] py-[8px] rounded-md hover:bg-red-600 hover:text-white ease-in cursor-pointer"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="font-semibold px-[16px] py-[8px] rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-400 cursor-pointer"
                >
                {isSubmitting ? "Loading..." : "Update"}
                </button>
            </div>
        </form>
    </div>
  )
}

export default UpdateProfile
*/