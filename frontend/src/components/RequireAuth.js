import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { Navigate, Outlet, useLocation } from "react-router-dom";


const RequireAuth = ({ allowedRoles }) => {
    const { user } = useContext(UserContext);
    const location = useLocation();

    return (
        user?.utorid
            ? (allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/forbidden" state={{ from: location }} replace/>) 
            : <Navigate to="/login" state={{ from: location }} replace/>
    )
}

export default RequireAuth;