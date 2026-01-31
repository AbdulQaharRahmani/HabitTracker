import { FaEnvelope } from "react-icons/fa"
export default function Logs(){
    return(
        <>
      {/* header  */}
     <div className="flex md:justify-between justify-center gap-5 flex-wrap flex-1 p-10">
  <h1 className="font-bold text-xl">Log Management & Analytics Dashboard</h1>

  <div className="flex items-center gap-3">
      <span className="font-bold">Admin</span>
      <span className="text-2xl text-gray-300">|</span>
      <button className="py-1 px-4 rounded-[0.7rem] text-white bg-indigo-600">
          Logout
      </button>
      <FaEnvelope className="text-indigo-600 cursor-pointer" size={20} />
  </div>
</div>
    </>
    )
}
