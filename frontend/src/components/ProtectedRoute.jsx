import { Navigate, Outlet } from "react-router"
import useAuthStore from "../store/useAuthStore"

export default function ProtectedRoute (){
    const token = useAuthStore((state)=> state.token)

    if(!token){
        return <Navigate to="/login" />
    }
    return <Outlet />
}
