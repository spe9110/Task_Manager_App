
const AddTaskBtn = ({ value, icon, onclick }) => {
  return (
      <button
        onClick={onclick}
        className="bg-green-600 border border-green-600 flex justify-center items-center font-bold rounded-md px-3 py-1 xs:px-3.5 xs:py-1.5 sm:px-4 sm:py-2 space-x-2 cursor-pointer text-white hover:bg-green-500 hover:border-green-500"
      >
        <span>{value}</span>
        <span>{icon}</span>
      </button>
  );
};

export default AddTaskBtn;