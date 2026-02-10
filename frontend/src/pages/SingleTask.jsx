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
  left: '64px'
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

              {/* <DeleteTask  closeModal={handleCloseModal} /> */}
            </Modal>
            {/* update task */}
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
}

export default SingleTask