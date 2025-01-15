import { Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const navigate=useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? children : navigate("/");
};

export default PrivateRoute;
