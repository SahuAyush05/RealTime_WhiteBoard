/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from "react";
import { LuImagePlus, LuMousePointer2, LuUndo2 } from "react-icons/lu";
import { FaRegHandPointer, FaPencilAlt } from "react-icons/fa";
import { LiaMarkerSolid } from "react-icons/lia";
import { PiShapesLight } from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { IoColorFillOutline } from "react-icons/io5";
import { MdOutlineArrowOutward } from "react-icons/md";
import { TbOvalVertical } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { changeTool } from "../store/toolBoxSlice";
import ToolButton from "./utils/ToolButton";
import { PiRectangle } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa6";
import { setStrokeColor, setStrokeWidth } from "../store/boardSlice";
import {
  TfiLayoutLineSolid,
  TfiLineDashed,
  TfiLineDotted,
} from "react-icons/tfi";
import { ColorPicker } from "antd";

const Sidebar = () => {
  const { tabs } = useSelector((state) => state.enable);
  const dispatch = useDispatch();
  const [selectedValues, setSelectedValues] = useState({
    marker: "Black",
    pencil: [],
    shapes: "rectangle",
    text: "small",
  });
  const [color, setColor] = useState("#1677ff");
  const bgColor = useMemo(
    () => (typeof color === "string" ? color : color.toHexString()),
    [color]
  );
  useEffect(() => {
    dispatch(setStrokeColor(bgColor));
  }, [bgColor, dispatch]);
  const dropdownOptions = {
    marker: [
      { value: "marker", label: LiaMarkerSolid, color: "black", width: 8 },
      { value: "marker", label: LiaMarkerSolid, color: "red", width: 8 },
      { value: "marker", label: LiaMarkerSolid, color: "green", width: 8 },
      { value: "marker", label: LiaMarkerSolid, color: "#254687", width: 8 },
    ],
    pencil: [
      {
        value: "pen",
        label: TfiLayoutLineSolid,
        dash: [],
        type: "straignt",
        width: 4,
      },
      {
        value: "pen",
        label: TfiLineDashed,
        dash: [23, 15],
        type: "dash",
        width: 4,
      },
      {
        value: "pen",
        label: TfiLineDotted,
        dash: [0.01, 10, 0.01, 10],
        type: "dotted",
        width: 4,
      },
    ],
    shapes: [
      { value: "rect", label: PiRectangle,width:4 },
      { value: "circle", label: FaRegCircle,width:4 },
      { value: "ellipse", label: TbOvalVertical,width:4 },
    ],
    text: [
      { value: "Straight", label: TfiLayoutLineSolid, straight: true,width:4 },
      { value: "Curve", label: TfiLineDashed, straight: false,width:4 },
    ],
  };

  const handleToolChange = (value) => {
    dispatch(changeTool(`${value}`));
  };

  return (
    <div className="flex w-full h-[80%] items-center rounded bg-white flex-col gap-1">
      <button
        value="mouse"
        onClick={(e) => {
          handleToolChange(e.currentTarget.value);
        }}
        className="bg-white text-black h-[1.4em] text-[1.2em] m-1"
      >
        <LuMousePointer2 />
      </button>
      <button
        value="hand"
        onClick={(e) => {
          handleToolChange(e.currentTarget.value);
        }}
        className="bg-white text-black h-[1.4em] text-[1.2em] m-1"
      >
        <FaRegHandPointer />
      </button>
      <ToolButton
        type="pencil"
        icon={FaPencilAlt}
        value="pen"
        options={dropdownOptions.pencil}
        selectedValue={selectedValues.pencil}
        onChange={handleToolChange}
        disabled={!tabs}
      />
      <ToolButton
        type="marker"
        icon={LiaMarkerSolid}
        value="marker"
        options={dropdownOptions.marker}
        selectedValue={selectedValues.marker}
        onChange={handleToolChange}
        disabled={!tabs}
      />
      <button
        value="arrow"
        onClick={(e) => {
          handleToolChange(e.currentTarget.value);
          dispatch(setStrokeWidth(4));
        }}
        className="bg-white text-black h-[1.4em] text-[1.2em] m-1"
      >
        <MdOutlineArrowOutward />
      </button>
      <ToolButton
        type="shapes"
        icon={PiShapesLight}
        value="shapes"
        options={dropdownOptions.shapes}
        selectedValue={selectedValues.shapes}
        onChange={handleToolChange}
        disabled={!tabs}
      />
      <ToolButton
        type="text"
        icon={CiText}
        value="text"
        options={dropdownOptions.text}
        selectedValue={selectedValues.text}
        onChange={handleToolChange}
        disabled={!tabs}
      />
      <ColorPicker value={color} onChange={setColor}>
        <button
          type="primary"
          className="bg-white text-black shadow-none hover:bg-[white] h-[1.4em] text-[1.2em] m-2"
        >
          <IoColorFillOutline style={{ color: bgColor }} />
        </button>
      </ColorPicker>
      <ToolButton
        type="image"
        icon={LuImagePlus}
        value="image"
        onChange={handleToolChange}
        disabled={!tabs}
      />
      <ToolButton
        type="undo"
        icon={LuUndo2}
        value="undo"
        onChange={handleToolChange}
        disabled={!tabs}
      />
    </div>
  );
};

export default Sidebar;
