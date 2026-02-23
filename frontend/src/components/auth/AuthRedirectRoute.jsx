import {Navigate,Outlet} from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const AuthRedirectRoute= ()=>{
  const isAuthenticated = useAuthStore(state=>state.isAuthenticated);

  if(isAuthenticated){
     return <Navigate to ="/" replace />
  }

  return <Outlet/>
}


export default AuthRedirectRoute;
