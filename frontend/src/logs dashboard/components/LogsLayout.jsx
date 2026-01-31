import LogsSidebar from "./LogsSidebar"
import { Outlet } from "react-router";
export default function LogsLayout (){
  return (
    <div className="dashboard-wrapper flex w-full flex-row ">
      <LogsSidebar />
         <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
