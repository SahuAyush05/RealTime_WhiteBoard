/* eslint-disable no-unused-vars */
import { useRef, useCallback, useEffect } from "react";
import { Layer, Rect, Line, Stage, Circle, Ellipse, Arrow } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { addShape, getSocket, updateShape } from "../../utils/socket";
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
  setActivePage,
  addPage,
} from "../../store/boardSlice";
import { v4 as uuid } from "uuid";
import { emitAddPage } from "../../utils/socket";

const Konva = () => {
  const { pages, activePageIndex, strokeWidth, strokeColor } = useSelector(
    (state) => state.board
  );
  const { project } = useSelector((state) => state.project);
  const dash = useSelector((state) => state.toolBox.penDash);
  const { currentTool, markerColor } = useSelector((state) => state.toolBox);
  const dispatch = useDispatch();
  const isPaintRef = useRef(false);
  const stageRef = useRef(null);
  const currentShapeRef = useRef();

  const addNewPage = () => {
    emitAddPage(project.roomKey, project._id);
  };
  useEffect(() => {
    const socket = getSocket();
    const handlePageAdded = ({ newPage, pages }) => {
      console.log("PageAdded");
      dispatch(addPage(newPage));
      dispatch(setActivePage(pages.length));
    };
    
    const handleAddShape = ({ data, id, shape }) => {
      console.log(data, id, shape);
      switch (shape) {
        case "Rectangle": {
          dispatch(
            addRectangle({
              data,
              id,
            })
          );
          break;
        }
        default:
          break;
      }
    };
    const handleUpdateShape = ({
      updatedData,
      shape,
      rectangleId,
      pageIndex,
    }) => {
      switch (shape) {
        case "Rectangle": {
          dispatch(updateRectangle({ updatedData, rectangleId, pageIndex }));
          break;
        }
        default:
          break;
      }
    };
    if (socket) {
      socket.on("pageAdded", handlePageAdded);
      socket.on("addShapeRes", handleAddShape);
      socket.on("updateShapeRes", handleUpdateShape);
    }
    return () => {
      socket.off("pageAdded", handlePageAdded);
    };
  }, [dispatch]);

  const switchPage = (index) => {
    dispatch(setActivePage(index));
  };

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

    const activePage = pages[activePageIndex];
    if (!activePage) return;

    switch (currentTool) {
      case "rect": {
        const data = {
          height: 0.5,
          width: 0.5,
          x,
          y,
          color: strokeColor,
          strokeWidth,
        };
        const shape = "Rectangle";
        const pageIdx = activePageIndex;
        console.log(project._id, pageIdx);
        dispatch(
          addRectangle({
            id,
            pageId: activePage.id,
            data,
          })
        );
        addShape(project.roomKey, project._id, shape, data, id, pageIdx)
        break;
      }
      case "pen": {
        dispatch(
          addScribble({
            id,
            points: [x, y],
            pageId: activePage.id,
            color: strokeColor,
            strokeWidth,
            dash: dash,
            type: "pen",
          })
        );
        break;
      }
      case "marker": {
        dispatch(
          addMarker({
            id,
            points: [x, y],
            pageId: activePage.id,
            color: markerColor,
            strokeWidth,
            type: "marker",
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
            pageId: activePage.id,
            color: strokeColor,
            strokeWidth,
            type: "circle",
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
            pageId: activePage.id,
            color: strokeColor,
            strokeWidth,
            type: "ellipse",
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
            pageId: activePage.id,
            color: strokeColor,
            strokeWidth,
            type: "arrow",
          })
        );
        break;
      }
      default:
        break;
    }
  }, [pages, activePageIndex, currentTool, strokeColor, strokeWidth, project._id, project.roomKey, dispatch, dash, markerColor]);

  const onStageMouseMove = useCallback(() => {
    if (!isPaintRef.current) return;

    const stage = stageRef.current;
    const id = currentShapeRef.current;
    const pos = stage.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    const activePage = pages[activePageIndex];
    if (!activePage) return;

    switch (currentTool) {
      case "rect": {
        const updatedData = {
          height: y,
          width: x,
        };
        const rectangleId= id
        const pageIndex= activePageIndex
        updateShape({
          roomKey: project.roomKey,
          projectId: project._id,
          rectangleId: id,
          updatedData,
          pageIndex: activePageIndex,
          shape: "Rectangle",
        });
        dispatch(updateRectangle( {rectangleId,updatedData, pageIndex}) )
        break;
      }
      case "pen": {
        const scribble = pages[activePageIndex].Scribbles.find(
          (s) => s.id === id
        );
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
        const mark = pages[activePageIndex].Markers.find((m) => m.id === id);
        if (mark) {
          dispatch(
            updateMarker({
              id,
              pageId: activePage.id,
              points: [...(mark.points || []), x, y],
            })
          );
        }
        break;
      }
      case "circle": {
        const circle = pages[activePageIndex].Circles.find((c) => c.id === id);
        if (circle) {
          const radius = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
          dispatch(updateCircle({ id, pageId: activePage.id, radius }));
        }
        break;
      }
      case "ellipse": {
        const ellipse = pages[activePageIndex].Ellipses.find(
          (e) => e.id === id
        );
        if (ellipse) {
          const radiusX = Math.abs(x - ellipse.x);
          const radiusY = Math.abs(y - ellipse.y);
          dispatch(
            updateEllipse({ id, pageId: activePage.id, radiusX, radiusY })
          );
        }
        break;
      }
      case "arrow": {
        const arrow = pages[activePageIndex].Arrows.find((a) => a.id === id);
        if (arrow) {
          const newPoints = [...arrow.points];
          newPoints[2] = x;
          newPoints[3] = y;
          dispatch(
            updateArrow({ id, pageId: activePage.id, points: newPoints })
          );
        }
        break;
      }
      default:
        break;
    }
  }, [
    pages,
    activePageIndex,
    currentTool,
    project.roomKey,
    project._id,
    dispatch,
  ]);

  // const handleDoubleClick = (id) => {
  //   dispatch(startEditing({ id }));
  // };

  // const handleTextChange = (id, newText) => {
  //   dispatch(updateText({ id, newText }));
  // };

  return (
    <div className="w-[70%] h-full bg-gray-200">
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <button
          onClick={addNewPage}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          New Page
        </button>
        <div className="flex gap-4">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => switchPage(index)}
              className={`py-2 px-4 rounded ${
                activePageIndex === index
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              Page {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="w-70%">
        <Stage
          width={1000}
          height={610}
          ref={stageRef}
          onMouseUp={onStageMouseUp}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          className="bg-white"
        >
          <Layer>
            {pages[activePageIndex]?.Rectangles.map((rectangle) => (
              <Rect
                key={rectangle.id}
                x={rectangle.data.x}
                y={rectangle.data.y}
                height={rectangle.data.height}
                width={rectangle.data.width}
                stroke={rectangle.data.color}
                strokeWidth={rectangle.data.strokeWidth}
              />
            ))}
            {pages[activePageIndex]?.Scribbles.map((scribble) => (
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
            {pages[activePageIndex]?.Markers.map((mark) => (
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
            {pages[activePageIndex]?.Circles.map((circle) => (
              <Circle
                key={circle.id}
                x={circle.x}
                y={circle.y}
                radius={circle.radius}
                stroke={circle.color}
                strokeWidth={circle.strokeWidth}
              />
            ))}
            {pages[activePageIndex]?.Ellipses.map((ellipse) => (
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
            {pages[activePageIndex]?.Arrows.map((arrow) => (
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
            {/* {texts.map((text) => (
            <>
              <Text
                key={text.id}
                x={text.x}
                y={text.y}
                text={text.text}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily}
                fill={text.fill}
                draggable
                onDblClick={() => handleDoubleClick(text.id)}
              />
              {text.isEditing && (
                <textarea
                  style={{
                    position: "absolute",
                    top: text.y,
                    left: text.x,
                    fontSize: `${text.fontSize}px`,
                    fontFamily: text.fontFamily,
                    color: text.fill,
                  }}
                  value={text.text}
                  onChange={(e) => handleTextChange(text.id, e.target.value)}
                  onBlur={() => dispatch(setEditingOff())}
                  autoFocus
                />
              )}
            </>
          ))}
          {images.map((img) => (
            <Image
              key={img.id}
              x={img.x}
              y={img.y}
              width={img.width}
              height={img.height}
              image={(() => {
                const imageObj = new window.Image();
                imageObj.src = img.src;
                return imageObj;
              })()}
              draggable
              onDragEnd={(e) => {
                dispatch(
                  updateImage({
                    id: img.id,
                    x: e.target.x(),
                    y: e.target.y(),
                  })
                );
              }}
            />
          ))} */}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default Konva;
