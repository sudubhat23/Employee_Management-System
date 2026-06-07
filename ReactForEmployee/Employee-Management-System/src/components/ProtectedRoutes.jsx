import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext"

const ProtectedRoutes = ({children}) => {
    // console.log(children);
    const {isAuthenticated} = useAuth();
    console.log(isAuthenticated);
    // console.log(isAuthenticated)

    if(!isAuthenticated){
        return <Navigate to='/login'></Navigate>
    } else {
        return children;
    }
}

export default ProtectedRoutes;