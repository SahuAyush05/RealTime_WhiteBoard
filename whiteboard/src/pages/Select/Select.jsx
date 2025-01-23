import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { connectSocket, joinRoom } from "../../utils/socket";
import { LuLayoutDashboard } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { enableCanva } from "../../store/enable";
import { createProject,joinProject } from "../../store/projectSlice";
import { initializeBoard } from "../../store/boardSlice";
const Select = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  // const { project } = useSelector((state) => state.project);
  const handleBlankCanva = async () => {
    dispatch(enableCanva(true));
  
    const projectData = {
      userId: user?.id,
      name: "New Project",
    };
  
    try {
      const action = await dispatch(createProject(projectData));
  
      if (createProject.fulfilled.match(action)) {
        const projectPayload = action.payload;
        dispatch(initializeBoard(projectPayload));
  
        if (projectPayload.roomKey) {
          const socket = connectSocket("http://localhost:5000");
          joinRoom(projectPayload.roomKey, user.id);
          navigate(`/whiteboard/${projectPayload.roomKey}`);
        }
      } else {
        console.error("Project creation failed:", action.error);
      }
    } catch (error) {
      console.error("Error creating project:", error.message || error);
    }
  };
  const handleJoinSession = async () => {
    dispatch(enableCanva(true));

    if (!sessionId) {
      console.error("Session ID is required to join a session.");
      return;
    }

    try {
      const action = await dispatch(joinProject(sessionId));

      if (joinProject.fulfilled.match(action)) {
        const projectPayload = action.payload;
        //console.log(projectPayload.project);
        dispatch(initializeBoard(projectPayload.project));
        if (projectPayload.project.roomKey) {
          
          const socket = connectSocket("http://localhost:5000");
          joinRoom(projectPayload.project.roomKey, user.id);
          navigate(`/whiteboard/${projectPayload.project.roomKey}`);
        }
      } else {
        console.error("Failed to join session:", action.error.message || action.error);
      }
    } catch (error) {
      console.error("Error joining session:", error.message || error);
    }
  };

  const [sessionId, setSessionId] = useState();
  return (
    <div className="w-[600px] h-[300px] bg-white rounded-xl shadow-lg flex flex-row z-[10]">
      <div className=" w-[50%] h-full ml-2 flex flex-col">
        <div className="h-[50%] pt-10 pl-4 ">
          <p className="font-medium text-[1.5em] text-gray-800 leading-none">
            New Project
          </p>
          <p className="text-[1.1em] text-gray-500 leading-none">
            Choose your way to start.
          </p>
        </div>
        <div className="h-[50%] pl-4 flex pb-10 flex flex-col justify-center ">
          <div className="flex flex-row items-center gap-2 py-2 text-[1.1em]">
            <LuLayoutDashboard />
            <h3 className="text-[#4959AC] font-medium">My Projects</h3>
          </div>
          <div className="flex flex-row">
            <input
              type="text"
              className="border-2 border-gray-400 h-[2.8em] p-1 text-gray-400 rounded"
              placeholder="Enter invite code"
              onChange={(e) => {
                setSessionId(e.target.value);
              }}
            />
            <button
              type="submit"
              className="bg-gray-300 h-[2.8em] w-[4em] rounded hover:bg-[#4959AC]"
              onClick={handleJoinSession}
            >
              <FaArrowRight className="m-auto text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="w-[50%] my-4 mr-4 flex flex-col justify-center gap-4">
        <Link className="h-[34%]" onClick={handleBlankCanva}>
          <div className=" h-full  rounded-xl bg-[#1ABDB1] flex flex-col p-4 justify-center bg-opacity-70">
            <div className="w-[50%] flex-row text-[1.2em] leading-none font-medium ">
              <p>Blank</p>
              <p>Canvas</p>
            </div>
          </div>
        </Link>
        <div className=" h-[34%] rounded-xl bg-[#ffbc5c] flex flex-col p-4 justify-center ">
          <div className="w-[50%] flex-row text-[1.2em] leading-none font-medium ">
            <p>Create</p>
            <p>Session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Select;
