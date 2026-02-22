import {useState, useCallback} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa6";
import { fetchSingleUserTask } from '../API/api';
import { useQuery } from '@tanstack/react-query';
import Loader from '../components/Loader';
import Modal from "react-modal";
import UpdateTask from './UpdateTask';
import DeleteTask from './DeleteTask';

Modal.setAppElement("#root");


const styleGoBack = {
  backgroundColor: 'none',
  borderRadius: 'none',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',   // this is what you want instead of justify-items
  gap: '2px',
  textDecoration: 'none',
  transition: 'background-color 0.2s',
  position: 'absolute',
  top: '100px',
  // left: 'auto'
};

const SingleTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Modal state
  const [ showModalUpdateTask, setShowModalUpdateTask ] = useState(false);
  const [ showModalDeleteTask, setShowModalDeleteTask ] = useState(false);
  const [modalType, setModalType] = useState(null);

    //modal to handle task 
  const handleShowUpdateTaskModal = useCallback(() => {
    setShowModalUpdateTask(!showModalUpdateTask);
    setModalType("update");
  }, [showModalUpdateTask]);

  const handleShowDeleteTaskModal = useCallback(() => {
    setShowModalDeleteTask(!showModalDeleteTask);
    setModalType("delete");
  }, [showModalDeleteTask]);

  const handleCloseModal = useCallback(() => {
    setModalType(null);
  }, []);
  
  const customStyles = {
    overlay: {
      position: "fixed",
      inset: 0, // FULL SCREEN (important)
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      display: "flex",                // modern centering
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",                // mobile safe spacing
      zIndex: 1000,
      margin: "0px auto"
    },
    content: {
      position: "relative",
      inset: "auto",
      margin: 0,
      padding: 0,
      display: "flex",                // modern centering
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      background: "transparent",
      width: "100%",
      maxWidth: "900px",              // desktop limit
    },
  };
  // fetch user data using tanstack query
  const { data: task, isPending, isError, error } = useQuery({
    queryKey: ['task ID', id],
    // Make the queryFn read the id from queryKey
    queryFn: fetchSingleUserTask,
    // don't run the query until we have an id
    enabled: !!id,
  })
  
  // console.log("This is the detail of a task", task)

  // Loading UI
  if (isPending) {
    return <Loader />
  }

  // Error UI
  if (isError) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-xl text-red-500">
        Failed to load task details: {error?.data?.message || "Unknown error"}
      </div>
    );
  }
  return (
    <div
      className="w-full min-h-screen flex flex-col justify-center items-center
      px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40
      py-12 bg-slate-50 mt-12 lg:mt-24"
    >

      {/* Go Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={styleGoBack}
        className="left-[12px] lg:left-[64px]
        flex items-center gap-2
        text-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
      >
        <FaAngleLeft
          className="text-blue-700"
          size={20}
          aria-hidden="true"
        />
        <span>All Tasks</span>
      </button>

      {/* Task Card */}
      <article
        className="w-full
        max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
        bg-white border border-neutral-200 rounded-2xl shadow-md
        p-4 xs:p-6 sm:p-8
        flex flex-col gap-6 mt-18 sm:mt-20 md:mt-24 lg:mt-28"
      >

        {/* Task Title */}
        <h1
          id="task-title"
          className="text-lg xs:text-xl sm:text-2xl md:text-3xl
          font-bold break-words text-gray-900"
        >
          {task.name}
        </h1>

        {/* Status + Due Date */}
        <div className="flex flex-row justify-between items-center gap-2">
          <span
            role="status"
            className={`px-3 py-1 rounded-full text-sm font-semibold w-fit
            ${
              task.status === "Open"
                ? "bg-orange-600 text-white"
                : task.status === "Closed"
                ? "bg-green-700 text-white"
                : task.status === "Pending"
                ? "bg-yellow-600 text-black"
                : "bg-gray-600 text-white"
            }`}
          >
            {task.status}
          </span>

          <p>{new Date(task.due).toLocaleDateString()}</p>

        </div>

        {/* Task Description */}
        <section
          className="border border-neutral-300 rounded-lg
          p-3 xs:p-4 sm:p-6
          text-gray-700 text-sm sm:text-base
          leading-relaxed whitespace-pre-wrap break-words"
        >
          {task.description}
        </section>

        {/* Action Buttons */}
        <div className="flex flex-row justify-between items-center gap-3 mt-4">
          <button
            onClick={handleShowDeleteTaskModal}
            type='button'
            aria-label={`Delete task ${task.name}`}
            className="w-full sm:w-auto
            text-red-700 font-semibold
            hover:underline
            focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
          >
            Delete Task
          </button>

          <button
            type='button'
            onClick={handleShowUpdateTaskModal}
            aria-label={`Edit task ${task.name}`}
            className="w-full sm:w-auto
            text-green-700 font-semibold
            hover:underline
            focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
          >
            Edit Task
          </button>

        </div>
      </article>

      {/* Delete Modal */}
      <Modal
        isOpen={modalType === "delete"}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Delete Task Modal"
        ariaHideApp={false}
      >
        <DeleteTask onClose={handleCloseModal} />
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={modalType === "update"}
        onRequestClose={handleCloseModal}
        style={customStyles}
        contentLabel="Update Task Modal"
        ariaHideApp={false}
      >
        <UpdateTask closeModal={handleCloseModal} />
      </Modal>

    </div>
  );
}

export default SingleTask

/*
return (
  <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 xs:px-6 sm:px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 py-12 bg-slate-50">

    <button
      type="button"
      onClick={() => navigate(-1)}
      style={styleGoBack}
      aria-label="Go back"
      className='left-[12px] lg:left-[64px]'
    >
      <FaAngleLeft className='text-blue-400' size={20} />
      <span className='text-blue-400'>All Tasks</span>
    </button>

    <div className="
      w-full
      max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
      bg-white border border-neutral-200 rounded-2xl shadow-md
      p-4 xs:p-6 sm:p-8
      flex flex-col
      gap-6 mt-20 sm:mt-10
    ">

      <h1 className="
        text-lg xs:text-xl sm:text-2xl md:text-3xl
        font-bold break-words
      ">
        {task.name}
      </h1>

      <div className="flex flex-row justify-between items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold w-fit ${
          task.status === "Open" ? "bg-orange-500" :
          task.status === "Closed" ? "bg-green-500" :
          task.status === "Pending" ? "bg-yellow-500" : "bg-gray-500"
        }`}>
          {task.status}
        </span>
        <p className="text-gray-600 text-sm sm:text-base">
          Due: {new Date(task.due).toLocaleDateString()}
        </p>
      </div>

      <div className="
        border border-neutral-300 rounded-lg p-3 xs:p-4 sm:p-6
        text-gray-700 text-sm sm:text-base
        leading-relaxed whitespace-pre-wrap break-words
      ">
        {task.description}
      </div>

      <div className="flex flex-row justify-between items-center gap-3 mt-4">
        <button
          onClick={handleShowDeleteTaskModal}
          className="w-full sm:w-auto text-red-600 font-semibold hover:underline transition"
        >
          Delete Task
        </button>
        <button
          onClick={handleShowUpdateTaskModal}
          className="w-full sm:w-auto text-green-600 font-semibold hover:underline transition"
        >
          Edit Task
        </button>
      </div>

    </div>

    <Modal
      isOpen={modalType === "delete"}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      <DeleteTask onClose={handleCloseModal} />
    </Modal>

    <Modal
      isOpen={modalType === "update"}
      onRequestClose={handleCloseModal}
      style={customStyles}
    >
      <UpdateTask closeModal={handleCloseModal} />
    </Modal>

  </div>
);

*/ 

/*


return (
  <div className="w-full h-screen flex justify-center items-center">
    <button
      type="button"
      onClick={() => navigate(-1)}
      style={styleGoBack}
      aria-label="Go back"
      // className='flex justify-center items-center gap-2'
    >
      <FaAngleLeft className='text-blue-400' size={20} />
      <span className='text-blue-400'>All Tasks</span>
    </button>

    <div className="flex flex-col justify-start items-center">
      <h1 className="text-3xl font-bold">{task.name}</h1>
      <div className='w-[300px]flex flex-col justify-start items-center mt-6'>
        <div className='flex justify-start items-center gap-4 mb-2'>
            <span className={`px-3 py-1 text-white text-sm font-semibold ${
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
            <p>{new Date(task.due).toLocaleDateString()}</p>
        </div>
        <p className='border border-neutral-400 p-[24px] rounded-md shadow-md'>{task.description}</p>
        <div className='flex justify-between items-center mt-4'>
          <button onClick={handleShowDeleteTaskModal} className='text-red-600'>Delete task</button>
          <Modal
            isOpen={modalType === "delete"}
            onRequestClose={handleCloseModal}
            style={customStyles}
          >
            <DeleteTask onClose={handleCloseModal} />

          </Modal>
          <button onClick={handleShowUpdateTaskModal} className='text-green-600'>Edit task</button>
          <Modal
            isOpen={modalType === "update"}
            onRequestClose={handleCloseModal}
            style={customStyles}
          >
            <UpdateTask closeModal={handleCloseModal} />
          </Modal>
        </div>
      </div>
    </div>
  </div>
)
*/  