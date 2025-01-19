import { FaLessThan } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import { FaRegShareSquare } from "react-icons/fa";
import { RiMoreFill } from "react-icons/ri";
const Header = () => {
  return (
    <header className=" h-full flex flex-row justify-between items-center">
      <button
        className="w-[10%] rounded-sm h-full flex justify-center gap-2  items-center bg-white border-1"
        disabled="true"
      >
        <FaLessThan />
        <h3>Projects</h3>{" "}
      </button>
      <button
        className="w-[12%] rounded-sm h-full flex justify-center gap-2 items-center bg-white border-1 ml-[0.1em]"
        disabled="true"
      >
        <h3>Whiteboard</h3> <FaChevronDown className="pt-1" />
      </button>
      <div className="bg-white rounded-2xl w-[70%] ml-[0.3em] h-[2.4em] flex">
        <button className="w-[7%] bg-[#4959AC] h-full rounded-2xl flex items-center pl-4" disabled="true">
          <HiMiniUsers className="text-[1.3em] text-white" />
          <IoMdAdd className="text-white" />
        </button>
      </div>
      <div className="h-full bg-[#4959AC] w-[4%] flex justify-center items-center ml-1 rounded-3xl">
        <button disabled="true">
            <FaRegShareSquare className="text-white"/>
        </button>
      </div>
      <div className="h-full bg-[#4959AC] w-[4%] flex justify-center items-center ml-1 rounded-3xl">
        <button disabled="true">
            <RiMoreFill className="text-white text-[1.3em]"/>
        </button>
      </div>
    </header>
  );
};

export default Header;
