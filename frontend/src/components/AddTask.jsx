import { GrAdd } from "react-icons/gr";

export default function AddTask () {
  return (
    <div>
      <button
        className="bg-indigo-500 hover:bg-indigo-600  rounded-md px-4 py-2 text-white flex items-center justify-center shadow-md text-md transition ease-in-out duration-200"
        type="button"
      >
        <span className="mx-2 font-normal">
          <GrAdd size={14} />
        </span>
        <span>New Task</span>
      </button>
    </div>
  );
}
