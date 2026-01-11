import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useTaskCardStore } from "../store/useTaskCardStore";

export default function TaskCard ({title, deadline, category, done, id}) {
  const toggleTaskDone = useTaskCardStore((state) => state.toggleTaskDone);
  const deleteTask = useTaskCardStore((state) => state.deleteTask);

  return (
    <div className="flex bg-white rounded-xl shadow-sm mx-8">
      <div className="flex items-center justify-between border-r border-gray-300 mx-4 px-4 pr-8 text-center">
        <button onClick={() => toggleTaskDone(id)}>
          {done ? (
            <FaCheckCircle size={20} className="text-green-400" />
          ) : (
            <FaRegCircle
              size={20}
              className="text-gray-300 hover:text-green-400 transiton ease-in duration-100"
            />
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 justify-between items-start flex-1 md:justify-start md:grid-cols-[2fr_1fr]">
        <div className="my-1">
          <div
            className={`py-3 px-4 text-lg font-bold transition ${
              done ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {title}
          </div>

          <div className="flex flex-rows-2">
            <span className="bg-indigo-100 w-1/1 block rounded-xl mb-2 mx-4 p-2">
              <p className="flex flex-rows gap-2 text-[0.8rem] text-semibold text-indigo-600">
                <FaCircle size={6} className="mt-2" />
                Due:
                <span className="">{deadline}</span>
              </p>
            </span>
            <span className="py-2 text-[0.8rem] text-gray-300">
              {category}
            </span>
          </div>
        </div>
      </div>

      <div className=" p-4 flex items-center mx-4">
        <button 
          className=""
          onClick={() => deleteTask(id)}
        >
          <MdDeleteOutline
            size={24}
            className="text-gray-300 hover:text-red-400 transition"
          />
        </button>
      </div>
    </div>
  );
}