import { Navigate} from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

export const RequireAuthRoute = ({ children }) => {
    const {isAuthenticated} = useContext(AuthContext);

    if (!isAuthenticated) {
        return (<Navigate to="/login" replace />)
    }
    return children;
}