import { useState } from "react"
import { FaRegCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";


export default function TaskCard ({title, deadline, category}) {
    const [done, setDone] = useState()
    // const []

    function HandleTaskDone () {
        setDone(prev => !prev)
    }

    return (
      <div className="bg-white flex rounded-md shadow-sm mx-8">
        <div className="flex items-center justify-center border-r border-gray-300 mx-4 p-4 pr-8 text-center">
          <button onClick={HandleTaskDone}>
            {done ? (
              <FaCheckCircle size={28} className="text-green-300" />
            ) : (
              <FaRegCircle size={28} className="text-gray-300" />
            )}
          </button>
        </div>
        <div className="my-2">
          <div className="text-gray-800 py-3 px-4 text-xl text-bold">
            {title}
          </div>
          <div className="flex flex-rows-2">
            <span className="bg-indigo-100 w-1/2 block rounded-xl mb-2 mx-4 p-2">
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
    );
}