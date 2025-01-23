import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default PrivateRoute;
