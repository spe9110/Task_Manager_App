import React, { useState, useCallback } from "react";
import AddTaskBtn from "../components/AddTaskBtn";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import Modal from "react-modal";
import CreateTask from "./CreateTask";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchUserTaskData } from "../API/api";
import Loader from "../components/Loader"
import { Link } from "react-router-dom";


Modal.setAppElement("#root");

const Tasks = () => {
  const { userData } = useSelector((state) => state.auth);
   
  // const profile = response; // <--- RTK Query gives you accurate user data
  const navigate = useNavigate();
  // Modal state
    const [ showModalCreateTask, setShowModalCreateTask ] = useState(false);
    const [modalType, setModalType] = useState(null);
    
    // fetch user data using tanstack query
    const { data: tasks, isPending, isError, error } = useQuery({
      queryKey: ['tasks', userData?.id],
      // Make the queryFn read the id from queryKey
      queryFn: fetchUserTaskData,
      // don't run the query until we have an id
      enabled: !!userData?.id,
    })
    
    console.log("userData", userData?.id)
    console.log("tasks data from React Query (tanstack):", tasks);

  //modal for user profile 
  const handleShowCreateTaskModal = useCallback(() => {
    setShowModalCreateTask(!showModalCreateTask);
    setModalType("create");
  }, [showModalCreateTask]);
  
  const handleCloseModal = useCallback(() => {
    setModalType(null);
  }, []);

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
      zIndex: 1000, // optional: ensure it's on top
      backdropFilter: 'blur(5px)', // This blurs what's behind the overlay
      WebkitBackdropFilter: 'blur(5px)', // For Safari support
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
  };
    // Loading UI
    if (isPending) {
      return <Loader />
    }
  
    // Error UI
    if (isError) {
      return (
        <div className="w-full min-h-screen flex justify-center items-center text-xl text-red-500">
          Failed to load profile: {error?.message || "Unknown error"}
        </div>
      );
    }
  
    // Extract the data array from the response
  const taskList = tasks?.data || [];
  console.log('data to display: ', taskList)
  return (
    <div className="w-full min-h-screen flex flex-col py-24 px-[64px] bg-green-50">
      <h1 className="text-3xl font-bold">Task to do</h1>
      <div className="w-full h-auto border border-neutral-300 rounded-lg shadow-sm p-4">
        {/* title */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-between items-center space-x-2 border border-neutral-300 px-2 py-1 rounded-sm cursor-pointer">
            <span>All Tasks</span>
            <IoIosArrowDown className="inline-block" />
          </div>
          <AddTaskBtn value="Create New Task" icon={<FaPlus />} onclick={handleShowCreateTaskModal} />
          <Modal
            isOpen={modalType === "create"}
            onRequestClose={handleCloseModal}
            style={customStyles}
          >
            <CreateTask closeModal={handleCloseModal} />
          </Modal>
        </div>
        {/* tasks list table*/}

        <table className="w-full border-collapse border border-gray-400 p-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 text-start px-2 py-1">Task</th>
              <th className="border border-gray-300 text-start px-2 py-1">Priority</th>
              <th className="border border-gray-300 text-start px-2 py-1">Status</th>
              <th className="border border-gray-300 text-start px-2 py-1">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {taskList && taskList.length > 0 ? (
              taskList.map((task) => (
                <tr key={task._id} className="cursor-pointer hover:bg-slate-300" onClick={() => navigate(`/single-task/${task._id}`)}>
                  <td className="border border-gray-300 px-2 py-1">{task.name}</td>
                  <td className="border border-gray-300 px-2 py-1">{task.priority}</td>
                  <td className="border border-gray-300 px-2 py-1">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      task.status === 'Open' 
                        ? 'bg-orange-500 hover:bg-orange-600' 
                        : task.status === 'Closed'
                        ? 'bg-green-500 hover:bg-green-600'
                        : task.status === 'Pending'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {new Date(task.due).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border border-gray-300 px-2 py-1 text-center">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks