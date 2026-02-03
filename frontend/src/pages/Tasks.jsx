import React, { useState, useCallback } from "react";
import AddTaskBtn from "../components/AddTaskBtn";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Modal from "react-modal";
import CreateTask from "./CreateTask";

Modal.setAppElement("#root");

const Tasks = () => {
    // --- Fetch fresh data: SINGLE SOURCE OF TRUTH ---
    // const {
    //   data: response,
    //   isLoading: fetching,
    //   isError,
    //   error,
    // } = useFetchCurrentUserQuery();
  
    // const profile = response; // <--- RTK Query gives you accurate user data
  
    // Modal state
      const [ showModalCreateTask, setShowModalCreateTask ] = useState(false);
      const [modalType, setModalType] = useState(null);
  
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
    // if (fetching) {
    //   return (
    //     <div className="w-full min-h-screen flex justify-center items-center text-xl text-gray-500">
    //       Loading profile...
    //     </div>
    //   );
    // }
  
    // Error UI
    // if (isError) {
    //   return (
    //     <div className="w-full min-h-screen flex justify-center items-center text-xl text-red-500">
    //       Failed to load profile: {error?.data?.message || "Unknown error"}
    //     </div>
    //   );
    // }
  
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
            <tr>
              <td className="border border-gray-300 px-2 py-1">Go to work tomorrow</td>
              <td className="border border-gray-300 px-2 py-1">High</td>
              <td className="border border-gray-300 px-2 py-1">Pending</td>
              <td className="border border-gray-300 px-2 py-1">2024-12-15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks