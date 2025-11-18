import React from 'react'
import { IoClose } from "react-icons/io5";
import { useDeleteUserMutation } from '../redux/userApiSlice';
import { logout } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";

const DeleteAccount = ({ onClose, id }) => {
    const dispatch = useDispatch();
    const [deleteUser, { isLoading }] = useDeleteUserMutation(); 

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!id) {
            toast.error('No User ID provided!');
            return;
        }
        try {
            await deleteUser(id).unwrap();
            dispatch(logout());
            toast.success('User deleted successfully!');
            onClose();
        } catch (err) {
            console.error("Error while deleting:", err);
            toast.error(err?.data?.message || err.error || 'Delete failed.');
        }
    };
    return (
    <form onSubmit={handleDelete} className='bg-white w-[50vw] h-[50%]'>
        <div className='bg-transparent flex justify-end items-center w-full p-[32px] '>
            <button
                className="bg-transparent cursor-pointer border-1 border-slate-200 hover:bg-slate-100 p-[8px] rounded-full hover:duration-75"
                aria-label="Close modal"
                onClick={onClose}
                type="button"
            >
                <IoClose className="text-black" size={24} />
            </button>
        </div>
        <div className='px-[32px] pb-[32px]'>
            <div className='department_form flex flex-col items-center justify-start gap-4 pb-[32px]'>
                <h1 className='text-3xl font-bold text-center mt-[-32px] pb-[16px]'>Are you sure you want to delete your account?</h1>
                <p className='text-lg font-normal text-center'>This action cannot be undone. Once deleted, the user will be permanently removed and cannot be recovered.</p>
                <p className='text-xl font-semibold'>Please confirm if you want to proceed.</p>
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
                <button
                    className="border-2 bg-transparent border-red-600 font-semibold px-[16px] py-[8px] rounded-md hover:bg-red-600 hover:text-white ease-in cursor-pointer"
                    onClick={onClose}
                    type="button"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="font-semibold px-[16px] py-[8px] rounded-md bg-red-600 text-white shadow-sm hover:bg-red-400 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? 'Deleting...' : 'Confirm'}
                </button>
            </div>
        </div>
    </form>
  )
}

export default DeleteAccount