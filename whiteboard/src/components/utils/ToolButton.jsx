/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeMarkerColor, changeDashValue } from "../../store/toolBoxSlice";
import { setStrokeWidth } from "../../store/boardSlice";
const ToolButton = ({
  type,
  icon: Icon,
  value,
  options = [],
  selectedValue,
  onChange,
  disabled,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  const handleChangeMarker = ({ color, width }) => {
    dispatch(changeMarkerColor(color));
    dispatch(setStrokeWidth(width));
  };
  const handleChangePen = ({ dash, width }) => {
    dispatch(changeDashValue(dash));
    dispatch(setStrokeWidth(width));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".relative")) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="relative inline-flex items-center">
      <button
        className="h-[1.4em] m-2"
        disabled={disabled}
        onClick={toggleDropdown}
      >
        <Icon className="text-[1.2em]" />
      </button>

      {openDropdown && options.length > 0 && (
        <div className="absolute left-full  top-0 bg-white border rounded-md text-[1.2em] shadow-lg w-[40px] z-10 flex flex-col items-center justify-center">
          {options.map((option) => (
            <button
              key={
                option.value === "pen"
                  ? option.type
                  : option.value === "marker"
                  ? option.color
                  : option.value
              }
              className={`w-full text-left py-1 hover:bg-gray-100 ${
                selectedValue === option.value ? "bg-gray-50" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setOpenDropdown(false);
                option.value == "marker"
                  ? handleChangeMarker({
                      color: option.color,
                      width: option.width,
                    })
                  : "";
                option.value == "pen"
                  ? handleChangePen({ dash: option.dash, width: option.width })
                  : "";
                option.value == "rect" ||
                option.value == "ellipse" ||
                option.value == "circle"
                  ? dispatch(setStrokeWidth(4))
                  : "";
              }}
            >
              {value == "marker" ? (
                <option.label
                  style={{ color: option.color }}
                  className={` w-[2em]`}
                />
              ) : (
                <option.label className="w-[2em]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolButton;
