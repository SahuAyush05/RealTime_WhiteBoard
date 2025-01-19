import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
 const{isAuthenticated,user}= useSelector((state)=>state.auth);
  return (
    <footer className="bg-[#4959AC] bottom-1 h-full flex items-center">
      <div className="w-full flex flex-row p-2 items-center justify-between px-4">
        <h3 className="text-white text-[1.2em]">{isAuthenticated?`${user.name}`:"User"}</h3>
        <p className="text-white">Welcome to Whiteboard, one stop destination to your collaborations</p>
        <button className=" bg-white text-blue-500 font-bold h-8 w-28 px-4 rounded" disabled='true'>
          {isAuthenticated?"Log Out":"SignIn"}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
