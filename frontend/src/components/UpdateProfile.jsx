import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useUpdateUserMutation, useFetchCurrentUserQuery } from "../redux/userApiSlice";
import { setCredentials } from "../redux/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import AvatarUploader from "./AvatarUploader";

const schema = yup.object().shape({
  username: yup.string().min(2).max(20).required("Username is required"),
});

const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();

  // Fetch current user
  const { data: user, isLoading: fetching } = useFetchCurrentUserQuery();

  // Update mutation
  const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: "" },
  });

  // Sync form with fetched user
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setPreview(user.avatar);
    }
  }, [user, setValue]);

  const onSubmit = async (formData) => {
    if (!user) return toast.error("User data not loaded");

    try {
      // Build FormData
      const payload = new FormData();
      payload.append("username", formData.username);
      if (avatarFile) payload.append("avatar", avatarFile);

      const res = await updateProfile({ id: user.id, formData: payload }).unwrap();

      // Update Redux state
      dispatch(setCredentials(res.data));

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
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
        {/* Avatar */}
        <AvatarUploader
          imageUrl={preview}
          onFileSelect={(file) => {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            {...register("username")}
            className={`mt-1 block w-full rounded-md px-3 py-1.5 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>

        {/* Buttons */}
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
            disabled={updating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-blue-300"
          >
            {updating ? "Updating..." : "Update"}
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
  username: yup.string().min(2).max(20).required("Username is required"),
});

const UpdateProfile = ({ onClose }) => {
  const dispatch = useDispatch();

  // Fetch current user
  const { data: user, isLoading: fetching } = useFetchCurrentUserQuery();

  // Update mutation
  const [updateProfile, { isLoading: updating }] = useUpdateUserMutation();

  // Avatar preview + selected file
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: "" },
  });

  // Sync form with fetched user
  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setPreview(user.avatar);
    }
  }, [user, setValue]);

  // Submit handler
  const onSubmit = async (formData) => {
    try {
      // Prepare the body
      const body = { username: formData.username };
      if (avatarFile) body.file = avatarFile;

      // Call RTK mutation
      const res = await updateProfile({ id: user.id, file: avatarFile, username: formData.username }).unwrap();

      dispatch(setCredentials(res.data));

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

*/