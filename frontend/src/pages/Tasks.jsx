import AddTaskBtn from "../components/AddTaskBtn";
import { IoIosArrowDown } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

const Tasks = () => {
  console.log("Tasks mounted");
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
          <AddTaskBtn value="Create New Task" icon={<FaPlus />} onclick={() => alert("Add Task clicked")} />
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