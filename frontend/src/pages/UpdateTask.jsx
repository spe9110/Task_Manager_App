import {useEffect} from 'react'
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchSingleUserTask, updateUserTask } from '../API/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { IoClose } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';


const schema = yup.object({
  name: yup.string().min(3, "Task name must be at least 3 characters").max(100).trim().optional(),
  description: yup.string().max(500, "Description must be less than 500 characters").trim().optional(),
  priority: yup.string().oneOf(['Urgent', 'not urgent'], "Priority must be 'Urgent' or 'not urgent'").optional(),
  status: yup.string().oneOf(['Open', 'Done'], "Status must be 'Open' or 'Done'").optional(),
  due: yup.date().optional(),
}).optional()


const UpdateTask = ({ closeModal }) => {
  // const { userData } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        name: "",
        description: "",
        priority: "not urgent",
        status: "Open",
        due: null,
      },
  });

  // queryClient is used to invalidate former data after update
  const queryClient = useQueryClient();

  // fetch user data using tanstack query
  const { data: task, isPending } = useQuery({
    queryKey: ['task ID', id],
    // Make the queryFn read the id from queryKey
    queryFn: fetchSingleUserTask,
    // don't run the query until we have an id
    enabled: !!id,
  })
    
  // 🧠 Update form when task changes
  useEffect(() => {
    if (task) {
      reset({
        name: task.name ?? "",
        description: task.description ?? "",
        priority: task.priority ?? "not urgent",
        status: task.status ?? "Open",
        due: task.due ? new Date(task.due) : null,
      });
    }
  }, [task, reset]);


  // Edit data using tanstack query
  const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
    // define the mutation key for debug purpose
    mutationKey: ['update-task', id],
    // Call the function
    mutationFn: updateUserTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      toast.success("Task updated successfully");
      navigate(`/tasks`)
      closeModal(); // close modal
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update task");
    },
  })

  const onSubmit = (formData) => {
    const formattedData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      priority: formData.priority,
      status: formData.status,
      due: formData.due ? formData.due.toISOString() : null,
    };

    updateTaskMutation({
      id,
      data: formattedData,
    });
  };

  if(isUpdating || isPending) return <Loader />

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white w-[50vw] h-[80%] text-black'>
        {/* form title */}
        <div className='bg-neutral-50 flex justify-between items-center w-full h-[6rem] px-[32px] '>
            <h1 className='text-black text-2xl font-bold'>Update Task</h1>
            <button
                type="button"
                className="bg-transparent cursor-pointer border-1 border-slate-50 p-[8px] rounded-full hover:bg-neutral-300"
                aria-label="Close modal"
                onClick={closeModal}
            >
                <IoClose className="text-black" size={24} />
            </button>
        </div>
        {/* form content */}
        <div className='grid grid-cols-2 gap-6 p-[24px]'>
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

          {/* Description */}
          <div className='flex flex-col col-span-2'>
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
        </div>
        <div className="flex justify-end gap-4 p-[24px]">
          <button
            type="button"
            onClick={closeModal}
            className="px-[24px] py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-[24px] py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Editing..." : "Edit"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateTask