import { useRef, useCallback } from "react";
import { Layer, Text, Rect, Line, Stage } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addRectangle,
  updateRectangle,
  addScribble,
  updateScribble,
} from "../../store/boardSlice";
import { v4 as uuid } from "uuid";

const Konva = () => {
  const {
    rectangles = [], // Default to empty arrays
    scribbles = [],
    strokeWidth,
    strokeColor,
  } = useSelector((state) => state.board);

  const currentTool = useSelector((state) => state.toolBox.currentTool);
  const dispatch = useDispatch();
  const isPaintRef = useRef(false);
  const stageRef = useRef(null);
  const currentShapeRef = useRef();
  const dash = [23,15];
  const onStageMouseUp = useCallback(() => {
    isPaintRef.current = false;
  }, []);

  const onStageMouseDown = useCallback(() => {
    isPaintRef.current = true;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;
    const id = uuid();
    currentShapeRef.current = id;

    switch (currentTool) {
      case "rect": {
        dispatch(
          addRectangle({
            id,
            height: 0.5,
            width: 0.5,
            x,
            y,
            color: strokeColor,
            strokeWidth,
          })
        );
        break;
      }
      case "pen": {
        dispatch(
          addScribble({
            id,
            points: [x, y],
            color: strokeColor,
            strokeWidth,
          })
        );
        break;
      }
      default:
        break;
    }
  }, [dispatch, currentTool, strokeColor, strokeWidth]);

  const onStageMouseMove = useCallback(() => {
    if (!isPaintRef.current) return;

    const stage = stageRef.current;
    const id = currentShapeRef.current;
    const pos = stage.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    switch (currentTool) {
      case "rect": {
        dispatch(updateRectangle({ id, height: y, width: x }));
        break;
      }
      case "pen": {
        const scribble = scribbles.find((s) => s.id === id);
        if (scribble) {
          dispatch(
            updateScribble({
              id,
              points: [...(scribble.points || []), x, y], // Safeguard points
            })
          );
        }
        break;
      }
      default:
        break;
    }
  }, [dispatch, currentTool, scribbles]);

  return (
    <div className="w-[80%] h-[96%] bg-gray-400/40 mr-4 my-4">
      <Stage
        width={1153}
        height={662}
        ref={stageRef}
        onMouseUp={onStageMouseUp}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        className="bg-white m-auto"
      >
        <Layer>
          {rectangles.map((rectangle) => (
            <Rect
              key={rectangle.id}
              x={rectangle.x}
              y={rectangle.y}
              height={rectangle.height}
              width={rectangle.width}
              stroke={rectangle.color}
              strokeWidth={rectangle.strokeWidth}
            />
          ))}
          {scribbles.map((scribble) => (
            <Line
              key={scribble.id}
              points={scribble.points || []} // Fallback to empty array
              stroke={scribble.color}
              strokeWidth={scribble.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              dash={dash}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Konva;
