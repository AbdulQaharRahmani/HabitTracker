import { Navigate, Outlet } from "react-router"
import useAuthStore from "../store/useAuthStore"

export default function ProtectedRoute (){
    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)

    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    return <Outlet />
}
