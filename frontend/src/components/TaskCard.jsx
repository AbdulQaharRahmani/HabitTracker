import { useState } from "react"
import { FaRegCircle, FaCircle, FaCheckCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function TaskCard ({title, deadline, category}) {
    const [done, setDone] = useState(false)

    function HandleTaskDone () {
        setDone(prev => !prev)
    }

    return (
      <div className="flex bg-white rounded-md shadow-sm mx-8">

        <div className="flex items-center justify-between border-r border-gray-300 mx-4 p-4 pr-8 text-center">
          <button onClick={HandleTaskDone}>
            {done ? (
              <FaCheckCircle size={28} className="text-green-400" />
            ) : (
              <FaRegCircle size={28} className="text-gray-300 hover:text-green-400 transiton" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 justify-between items-start flex-1">
          <div className="my-2">
            <div
              className={`py-3 px-4 text-xl font-bold transition ${
                done ? "text-gray-400 line-through" : "text-gray-800"
              }`}
            >
              {title}
            </div>

            <div className="flex flex-rows-2">
              <span className="bg-indigo-100 w-1/3 block rounded-xl mb-2 mx-4 p-2">
                <p className="flex flex-rows gap-2 text-sm text-semibold text-indigo-600">
                  <FaCircle size={6} className="mt-2" />
                  Due:
                  <span className="">{deadline}</span>
                </p>
              </span>
              <span className="py-2 text-md text-gray-300">{category}</span>
            </div>
          </div>
        </div>

        <div className=" p-4 flex items-center mx-4">
          <button className="">
            <MdDeleteOutline
              size={24}
              className="text-gray-300 hover:text-red-400 transition"
            />
          </button>
        </div>

      </div>
    );
}