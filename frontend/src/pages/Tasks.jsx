import React, { useState, useCallback, useMemo } from "react";
import AddTaskBtn from "../components/AddTaskBtn";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import Modal from "react-modal";
import CreateTask from "./CreateTask";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchPaginatedTasks } from "../API/api";
import Loader from "../components/Loader"
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { DateTime } from "luxon";
import EmptyFolder from "../assets/icons8-dossier-ouvert.svg"
import SortedHeader from "../components/SortedHeader";


Modal.setAppElement("#root");

const Tasks = () => {
  const { userData } = useSelector((state) => state.auth);
  // const queryClient = useQueryClient();
  // const profile = response; // <--- RTK Query gives you accurate user data
  const navigate = useNavigate();
  // Modal state
  const [ showModalCreateTask, setShowModalCreateTask ] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "All";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";
  
  // he user is authenticated and ready ONLY if: We have a user id - AND we have an access token"
  const isAuthReady = Boolean(userData?.id && userData?.accessToken);
    // fetch user data using tanstack query
  const { data: tasks, isPending, isError, error } = useQuery({
    queryKey: ['tasks', userData?.id, page, limit, status, sort, order],
    // Make the queryFn read the id from queryKey
    queryFn: fetchPaginatedTasks, // ✅ DO NOT wrap it
    // don't run the query until we have an id
    // enabled: !!userData?.id, // only run when userData.id exists
    enabled: isAuthReady,
    keepPreviousData: true,
    retry: false, // prevent auto retries that might show blank
    // select: (data) => data ?? queryClient.getQueryData(['tasks', userData?.id, page, limit, status, sort, order]),
  })
  
  console.log("userData", userData?.id)
  console.log("tasks data from React Query (tanstack):", tasks);

  // ✅ Change Page
  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  // ✅ Change Limit (Reset to page 1)
  const changeLimit = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);
    params.set("limit", newLimit);
    setSearchParams(params);
  };

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
  // columns definition and make the header clickable
const columns = useMemo(() => [
  {
    accessorKey: 'name',
    header: () => <SortedHeader label="Task" field="name" />,
  },
  {
    accessorKey: 'priority',
    header: () => <SortedHeader label="Priority" field="priority" />,
  },
  {
    accessorKey: 'status',
    header: () => <SortedHeader label="Status" field="status" />,
  },
  {
    accessorKey: "due",
    header: () => <SortedHeader label="Due Date" field="due" />,
    cell: (info) => {
      const value = info.getValue();
      if (!value) return "-";
      return DateTime.fromISO(value).toFormat("dd LLL yyyy");
    }
  }
], [searchParams]);


  // Handle filter
const handleStatus = (e) => {
  const value = e.target.value;

  const params = new URLSearchParams(searchParams);
  params.set("page", 1); // reset to page 1 when filtering

  if (value === "All") {
    params.delete("status"); // remove status from URL
  } else {
    params.set("status", value);
  }

  setSearchParams(params);
};


  // Extract the data array from the response
const taskList = tasks?.data || [];
const totalTasks = tasks?.pagination?.totalTasks ?? [];

  // create instance of table
  const table = useReactTable({
    columns,
    data: taskList, //stable reference
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // 👈 tells table sorting is server-side
  })

  // ✅ Handle loading
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div className="w-full min-h-screen flex flex-col py-24 px-[64px] bg-green-50">
      <h1 className="text-3xl font-bold">Task to do</h1>
      <div className="w-full h-auto border border-neutral-300 rounded-lg shadow-sm p-4">

        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-between items-center space-x-2 border border-neutral-300 px-2 py-1 rounded-sm cursor-pointer">
            <select className="bg-transparent cursor-pointer"
              onChange={handleStatus}
              value={status}
            >
              <option className="cursor-pointer" value="All">All Tasks</option>
              <option className="cursor-pointer" value="Open">Open</option>
              <option className="cursor-pointer" value="Done">Done</option>
            </select>
            {/* <IoIosArrowDown className="inline-block" /> */}
          </div>
          <AddTaskBtn icon={<FaPlus />} value="Create New Task" onclick={handleShowCreateTaskModal} />
          <Modal
            isOpen={modalType === "create"}
            onRequestClose={handleCloseModal}
            style={customStyles}
          >
            <CreateTask closeModal={handleCloseModal} />
          </Modal>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-green-400">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="border px-2 py-1 text-start">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => navigate(`/single-task/${row.original._id}`)}
                  className="hover:bg-neutral-200 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border px-2 py-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-10">
                    <img src={EmptyFolder} alt="empty folder" className="w-16 h-16 mb-4" />
                    <p className="text-gray-500">No tasks found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <div className="pagination w-full flex justify-between items-center mt-2">

        {/* ✅ Pagination Component */}
        <Pagination
          itemCount={totalTasks}
          pageSize={limit}
          currentPage={page}
          onPageChange={changePage}
        />

        {/* ✅ Limit Selector */}
        <div className="flex-2 mt-4">
          <select
            value={limit}
            onChange={(e) => changeLimit(Number(e.target.value))}
            className="border p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Tasks


/*
  // fetch user data using tanstack query
  const { data: tasks, isPending, isError, error } = useQuery({
    queryKey: ['tasks', userData?.id],
    // Make the queryFn read the id from queryKey
    queryFn: fetchPaginatedTasks,
    // don't run the query until we have an id
    enabled: !!userData?.id,
    keepPreviousData: true
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

    return (
    <div className="w-full min-h-screen flex flex-col py-24 px-[64px] bg-green-50">
      <h1 className="text-3xl font-bold">Task to do</h1>
      <div className="w-full h-auto border border-neutral-300 rounded-lg shadow-sm p-4">
   
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
      <Pagination itemCount={100} pageSize={10} currentPage={1}/>
    </div>
  )
*/ 

