import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { enableCanva } from "../store/enable";

const RouteWatcher = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== "/blankCanva") {
      dispatch(enableCanva(false));
    }
  }, [location, dispatch]);

  return children;
};

export default RouteWatcher;
