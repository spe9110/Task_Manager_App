import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useUpdateUserMutation, useFetchCurrentUserQuery } from "../redux/userApiSlice";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import AvatarUploader from "./AvatarUploader";
import { useNavigate } from "react-router-dom";


// =======================
// VALIDATION SCHEMA
// =======================
const schema = yup.object().shape({
  username: yup
    .string()
    .min(2, "Minimum 2 characters")
    .max(20, "Maximum 20 characters")
    .required("Username is required"),

  avatar: yup
    .mixed()
    .nullable()
    .test("fileSize", "Max file size is 5MB", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only JPEG and PNG allowed", (value) => {
      if (!value || !(value instanceof File)) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});


const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Fetch logged-in user
  const { data: user, isLoading: fetching, error } = useFetchCurrentUserQuery();

  // RTK mutation
  const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

  // Local avatar preview + file
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);


  // =======================
  // FORM CONTROL
  // =======================
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      avatar: null,
    },
  });

  // Prefill when fetching user
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setPreview(user.avatar);
    }
  }, [user, setValue]);


  // =======================
  // SUBMIT LOGIC
  // =======================
  const onSubmit = async ({ username }) => {
    try {
      const res = await updateProfile({
        id: user.id,
        file: avatarFile,
        username,
      }).unwrap();
      // Incoming backend userData
      const newUserData = res.user;
      dispatch(setCredentials({
        ...user,
        ...newUserData,
      }));

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Profile update failed");
      console.error(err);
    }
  };


  if (fetching) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error?.status === 401 && error?.redirect) {
      navigate(error.redirect); // redirect to Unauthorized page
  }

  return (
    <div className="relative bg-white w-[40vw] min-w-[340px] p-6 shadow-lg rounded-lg">

      {/* Close button */}
      <button
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
        onClick={onClose}
        type="button"
      >
        <IoClose size={24} />
      </button>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* AVATAR CONTROLLER */}
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <AvatarUploader
              imageUrl={preview}
              onFileSelect={(file) => {
                setAvatarFile(file);
                setPreview(URL.createObjectURL(file));
                field.onChange(file);       // Sync with yup
                setValue("avatar", file);   // Very important!
              }}
            />
          )}
        />

        {errors.avatar && (
          <p className="text-xs text-red-500">{errors.avatar.message}</p>
        )}


        {/* USERNAME INPUT */}
        <div>
          <label className="text-sm font-medium text-gray-700">Username:</label>

          <input
            type="text"
            {...register("username")}
            className={`mt-1 block w-full rounded-md px-3 py-1.5 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col lg:flex-row lg:justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border bg-red-100 rounded-md hover:bg-red-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || updating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-blue-300"
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
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useUpdateUserMutation, useFetchCurrentUserQuery } from "../redux/userApiSlice";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import AvatarUploader from "./AvatarUploader";

const schema = yup.object().shape({
  username: yup.string()
    .min(2, "Minimum 2 characters")
    .max(20, "Maximum 20 characters")
    .required("Username is required"),

  avatar: yup
    .mixed()
    .test("fileExists", "You must provide an image", (value) => {
      // No file provided → validation passes (OPTIONAL avatar)
      if (!value) return true;

      // Ensure value is a File instance
      return value instanceof File;
    })
    .test("fileSize", "File is too large. Max size is 5MB.", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Only JPEG and PNG formats are allowed", (value) => {
      if (!value || !(value instanceof File)) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});


const UpdateProfile = ({ onClose, id }) => {
  const dispatch = useDispatch();

  // Fetch current user
  const { data: user, isLoading: fetching } = useFetchCurrentUserQuery();

  // Update mutation
  const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

  // Avatar preview + selected file
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Form setup
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { 
      username: "",
      avatar: null
    },
  });

  // Sync form with fetched user
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setPreview(user.avatar);
    }
  }, [user, setValue]);

  // Submit handler
  const onSubmit = async ({ username, avatar}) => {
    try {
      // Call RTK mutation
      const res = await updateProfile({ id, file: avatarFile, username }).unwrap();

      dispatch(setCredentials(...res));

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Profile update failed");
    }
  };


  if (fetching) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="relative bg-white w-[40vw] min-w-[340px] p-6 shadow-lg rounded-lg">

      <button
        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
        onClick={onClose}
        type="button"
      >
        <IoClose size={24} />
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


        <Controller
          name="avatar"
          control={control}
          render={() => (
            <AvatarUploader
              imageUrl={preview}
              onFileSelect={(file) => {
                setAvatarFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          )}
        />

        <div>
          <label className="text-sm font-medium text-gray-700">Username:</label>

          <input
            type="text"
            {...register("username")}
            className={`mt-1 block w-full rounded-md px-3 py-1.5 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors.username && (
            <p className="text-xs text-red-500">{errors.username.message}</p>
          )}
        </div>


        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border bg-red-100 rounded-md hover:bg-red-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || updating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-blue-300"
          >
            {isSubmitting || updating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;

// DatePicker tuto - https://www.youtube.com/watch?v=rXpBeK8Q4WY&list=PLeO8M-2wYaaV5vh2lRWV7qt_-Io8agaf-&index=4

*/