import { useRef, useCallback } from "react";
import { Layer, Rect, Line, Stage, Circle, Ellipse , Arrow} from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addRectangle,
  updateRectangle,
  addScribble,
  updateScribble,
  addMarker,
  updateMarker,
  addCircle,
  addEllipse,
  updateCircle,
  updateEllipse,
  addArrow,
  updateArrow,
} from "../../store/boardSlice";
import { v4 as uuid } from "uuid";

const Konva = () => {
  const {
    rectangles = [],
    scribbles = [],
    marker = [],
    Circles = [],
    Ellipses = [],
    Arrows = [],
    strokeWidth,
    strokeColor,
  } = useSelector((state) => state.board);
  const dash = useSelector((state) => state.toolBox.penDash);

  const { currentTool, markerColor } = useSelector((state) => state.toolBox);
  const dispatch = useDispatch();
  const isPaintRef = useRef(false);
  const stageRef = useRef(null);
  const currentShapeRef = useRef();

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
            dash: dash,
          })
        );
        break;
      }
      case "marker": {
        dispatch(
          addMarker({
            id,
            points: [x, y],
            color: markerColor,
            strokeWidth,
          })
        );
        break;
      }
      case "circle": {
        dispatch(
          addCircle({
            id,
            x,
            y,
            radius: 1,
            color: strokeColor,
            strokeWidth,
          })
        );
        break;
      }
      case "ellipse": {
        dispatch(
          addEllipse({
            id,
            x,
            y,
            radiusX: 1,
            radiusY: 1,
            color: strokeColor,
            strokeWidth,
          })
        );
        break;
      }
      case "arrow": {
        dispatch(
          addArrow({
            id,
            x,
            y,
            points: [x, y, x, y], // Initial points
            color: strokeColor,
            strokeWidth,
          })
        );
        break;
      }

      default:
        break;
    }
  }, [currentTool, dispatch, strokeColor, strokeWidth, dash, markerColor]);

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
              points: [...(scribble.points || []), x, y],
            })
          );
        }
        break;
      }
      case "marker": {
        const mark = marker.find((m) => m.id === id);
        if (mark) {
          dispatch(
            updateMarker({
              id,
              points: [...(mark.points || []), x, y],
            })
          );
        }
        break;
      }
      case "circle": {
        const circle = Circles.find((c) => c.id === id);
        if (circle) {
          const radius = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
          dispatch(updateCircle({ id, radius }));
        }
        break;
      }
      case "ellipse": {
        const ellipse = Ellipses.find((e) => e.id === id);
        if (ellipse) {
          const radiusX = Math.abs(x - ellipse.x);
          const radiusY = Math.abs(y - ellipse.y);
          dispatch(updateEllipse({ id, radiusX, radiusY }));
        }
        break;
      }
      case "arrow": {
        const arrow = Arrows.find((a) => a.id === id);
        if (arrow) {
          const newPoints = [...arrow.points];
          newPoints[2] = x; 
          newPoints[3] = y; 
          dispatch(updateArrow({ id, points: newPoints }));
        }
        break;
      }
      default:
        break;
    }
  }, [currentTool, dispatch, scribbles, marker, Circles, Ellipses, Arrows]);

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
              points={scribble.points || []}
              stroke={scribble.color}
              strokeWidth={scribble.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              dash={scribble.dash}
            />
          ))}
          {marker.map((mark) => (
            <Line
              key={mark.id}
              points={mark.points || []}
              stroke={mark.color}
              strokeWidth={mark.strokeWidth}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          {Circles.map((circle) => (
            <Circle
              key={circle.id}
              x={circle.x}
              y={circle.y}
              radius={circle.radius}
              stroke={circle.color}
              strokeWidth={circle.strokeWidth}
            />
          ))}
          {Ellipses.map((ellipse) => (
            <Ellipse
              key={ellipse.id}
              x={ellipse.x}
              y={ellipse.y}
              radiusX={ellipse.radiusX}
              radiusY={ellipse.radiusY}
              stroke={ellipse.color}
              strokeWidth={ellipse.strokeWidth}
              closed
            />
          ))}
          {Arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              pointerLength={10}
              pointerWidth={10}
              fill={arrow.color}
              stroke={arrow.color}
              strokeWidth={arrow.strokeWidth}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Konva;
