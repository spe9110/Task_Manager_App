import { useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createUserTask } from '../API/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const schema = yup.object({
  name: yup.string().min(3, "Task name must be at least 3 characters").max(100).trim().required("Task name is required"),
  description: yup.string().max(500, "Description must be less than 500 characters").trim().optional(),
  priority: yup.string().oneOf(['Urgent', 'not urgent'], "Priority must be 'Urgent' or 'not urgent'").required("Priority is required"),
  status: yup.string().oneOf(['Open', 'Done'], "Status must be 'Open' or 'Done'").required("Status is required"),
  due: yup.date().required("Due date is required").typeError("Due date must be a valid date"),
}).required()

const CreateTask = ({ closeModal }) => {
  const { userData } = useSelector((state) => state.auth);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priority: "not urgent",
      status: "Open",
      due: new Date(), // Set default to today's date
    },
  })

  const queryClient = useQueryClient();

  const { mutate: createTaskMutate } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: createUserTask,
    onSuccess: (data) => {
      console.log("Task created successfully:", data);
      queryClient.invalidateQueries({
        queryKey: ["tasks", userData?.id],
      });
      reset();
      toast.success("Task created successfully");
      closeModal();
    },
    onError: (err) => {
      console.error("Create task failed:", err);
      toast.error(err.response?.data?.message || "Failed to create task. Please try again.");
    },
  })

  const onSubmit = (data) => {
    // Convert Date to ISO string (YYYY-MM-DD)
    const formattedData = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      priority: data.priority,
      status: data.status,
      due: new Date(data.due).toISOString().split('T')[0],
    }
    createTaskMutate(formattedData)
  }

  return (
    <div className='w-full h-full p-[36px] flex flex-col justify-center items-center'>
      <h1 className='font-bold text-3xl text-center mb-8'>Create New Task</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-2xl'>
        <div className='grid grid-cols-2 gap-6 mb-6'>
          
          {/* Task Name */}
          <div className='flex flex-col'>
            <label className='font-semibold text-gray-700 mb-2'>Task Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter task name (3-100 characters)"
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className='flex flex-col'>
            <label className='font-semibold text-gray-700 mb-2'>Priority</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.priority ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="not urgent">not urgent</option>
                  <option value="Urgent">Urgent</option>
                </select>
              )}
            />
            {errors.priority && (
              <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Status */}
          <div className='flex flex-col'>
            <label className='font-semibold text-gray-700 mb-2'>Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Open">Open</option>
                  <option value="Done">Done</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div className='flex flex-col'>
            <label className='font-semibold text-gray-700 mb-2'>Due Date</label>
            <Controller
              name="due"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  timeInputLabel='Time'
                  dateFormat='MM/dd/yyyy h:mm aa'
                  placeholderText="Select due date"
                  minDate={new Date()} // Prevent selecting past dates
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                    errors.due ? 'border-red-500' : 'border-gray-300'
                  }`}
                  // popperClassName='!fixed !top-auto !left-auto'
                  // popperPlacement='bottom-start'
                />
              )}
            />
            {errors.due && (
              <p className="text-xs text-red-500 mt-1">{errors.due.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className='flex flex-col mb-6'>
          <label className='font-semibold text-gray-700 mb-2'>Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Enter task description (optional, max 500 characters)"
                rows="4"
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default CreateTask