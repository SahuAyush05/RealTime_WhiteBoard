import React from "react";
import { LuImagePlus } from "react-icons/lu";
import { FaRegHandPointer } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { LiaMarkerSolid } from "react-icons/lia";
import { PiShapesLight } from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { IoColorFillOutline } from "react-icons/io5";
import { BsEraser } from "react-icons/bs";
import { LuMousePointer2 } from "react-icons/lu";
import { LuUndo2 } from "react-icons/lu";
const Sidebar = () => {
  return (
    <div className="flex w-[3%] h-[84%] items-center rounded bg-white flex-col gap-1">
      <button className="h-[1.4em] m-2" disabled='true'>
        <LuMousePointer2 className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <FaRegHandPointer className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <FaPencilAlt className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <LiaMarkerSolid className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <BsEraser className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <PiShapesLight className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <CiText className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <IoColorFillOutline className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <LuImagePlus className="text-[1.2em] " />
      </button>
      <button className="h-[1.4em] m-2" disabled='true'>
        <LuUndo2 className="text-[1.2em] " />
      </button>

    </div>
  );
};

export default Sidebar;
