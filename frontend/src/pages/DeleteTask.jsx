import React from 'react';
import { IoClose } from "react-icons/io5";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUserTask } from '../API/api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

const DeleteTask = ({ onClose }) => {
  const queryClient = useQueryClient();
//   const { userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
    const { id } = useParams();
  // Mutation to delete the task
  const { mutate: deleteTaskMutate, isLoading } = useMutation({
    mutationKey: ["delete-task"],
    mutationFn: deleteUserTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", id],
        // queryKey: ['tasks', id],
        refetchType: "all"
      });
      console.log('The task id: ', id)
      toast.success("Task deleted successfully");
      navigate("/tasks")
      onClose(); // close modal
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task. Try again.");
    }
  });

    const handleDelete = (e) => {
        e.preventDefault();
        if (!id) {
            console.error("Delete blocked: missing id");
            return;
        }
        deleteTaskMutate(id );
        console.log('delete todo succesfully', id);
    };


  return (
    <form
      onSubmit={handleDelete}
      className="bg-white w-[50vw] max-w-md rounded-lg shadow-lg"
    >
      <div className="flex justify-end items-center w-full p-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-transparent cursor-pointer border p-2 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>
      </div>

      <div className="px-6 pb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Delete Task</h1>
        <p className="text-gray-700 mb-2">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <p className="text-red-600 font-semibold mb-4">Task will be permanently removed.</p>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-500 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteTask;
