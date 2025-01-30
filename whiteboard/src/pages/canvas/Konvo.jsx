/* eslint-disable no-unused-vars */
import { useRef, useCallback, useEffect } from "react";
import { Layer, Rect, Line, Stage, Circle, Ellipse, Arrow } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import {
  addShape,
  getSocket,
  sendShapeData,
  updateShape,
} from "../../utils/socket";
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
      dispatch(addPage(newPage));
      dispatch(setActivePage(pages.length));
    };

    const handleAddShape = ({ data, id, shape }) => {
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
        case "Pen": {
          dispatch(
            addScribble({
              data,
              id,
            })
          );
          break;
        }
        case "Marker": {
          dispatch(
            addMarker({
              data,
              id,
            })
          );
          break;
        }
        case "Circle": {
          dispatch(
            addCircle({
              data,
              id,
            })
          );
          break;
        }
        case "Ellipse": {
          dispatch(
            addEllipse({
              data,
              id,
            })
          );
          break;
        }
        case "Arrow": {
          dispatch(
            addArrow({
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
    const handleUpdateShape = ({ updatedData, shape, id, pageIndex }) => {
      switch (shape) {
        case "Rectangle": {
          dispatch(updateRectangle({ updatedData, id, pageIndex }));
          break;
        }
        case "Pen": {
          dispatch(updateScribble({ updatedData, id, pageIndex }));
          break;
        }
        case "Marker": {
          dispatch(updateMarker({ updatedData, id, pageIndex }));
          break;
        }
        case "Circle": {
          dispatch(updateCircle({ updatedData, id, pageIndex }));
          break;
        }
        case "Ellipse": {
          dispatch(updateEllipse({ updatedData, id, pageIndex }));
          break;
        }
        case "Arrow": {
          dispatch(updateArrow({ updatedData, id, pageIndex }));
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
    console.log(pages);
    const len = pages[activePageIndex].Shapes.length;
    const shapeData = pages[activePageIndex].Shapes[len - 1];
    const pageIdx = activePageIndex;
    const projectId = project._id;
    if (shapeData) {
      sendShapeData({ shapeData, projectId, pageIdx });
    }
  }, [activePageIndex, pages, project._id]);

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
        dispatch(
          addRectangle({
            id,
            pageId: activePage.id,
            data,
          })
        );
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      case "pen": {
        const data = {
          points: [x, y],
          color: strokeColor,
          dash: dash,
          strokeWidth,
        };
        const shape = "Pen";
        const pageIdx = activePageIndex;
        dispatch(
          addScribble({
            id,
            pageId: activePage.id,
            data,
          })
        );
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      case "marker": {
        const data = {
          points: [x, y],
          color: markerColor,
          strokeWidth,
        };
        dispatch(
          addMarker({
            id,
            pageId: activePage.id,
            data,
          })
        );
        const shape = "Marker";
        const pageIdx = activePageIndex;
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      case "circle": {
        const data = { x, y, radius: 1, color: strokeColor, strokeWidth };
        dispatch(
          addCircle({
            id,
            pageId: activePage.id,
            data,
          })
        );
        const shape = "Circle";
        const pageIdx = activePageIndex;
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      case "ellipse": {
        const data = {
          x,
          y,
          radiusX: 1,
          radiusY: 1,
          color: strokeColor,
          strokeWidth,
        };
        dispatch(
          addEllipse({
            id,
            pageId: activePage.id,
            data,
          })
        );
        const shape = "Ellipse";
        const pageIdx = activePageIndex;
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      case "arrow": {
        const data = {
          x,
          y,
          points: [x, y, x, y],
          color: strokeColor,
          strokeWidth,
        };
        dispatch(
          addArrow({
            id,
            pageId: activePage.id,
            data,
          })
        );
        const shape = "Arrow";
        const pageIdx = activePageIndex;
        addShape(project.roomKey, project._id, shape, data, id, pageIdx);
        break;
      }
      default:
        break;
    }
  }, [
    pages,
    activePageIndex,
    currentTool,
    strokeColor,
    strokeWidth,
    project._id,
    project.roomKey,
    dispatch,
    dash,
    markerColor,
  ]);

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
        const pageIndex = activePageIndex;
        updateShape({
          roomKey: project.roomKey,
          projectId: project._id,
          id,
          updatedData,
          pageIndex: activePageIndex,
          shape: "Rectangle",
        });
        dispatch(updateRectangle({ id, updatedData, pageIndex }));
        break;
      }
      case "pen": {
        const scribble = activePage.Scribbles.data.find((s) => s.id === id);
        if (scribble) {
          const updatedData = {
            points: [...scribble.data.points, x, y],
          };
          updateShape({
            roomKey: project.roomKey,
            projectId: project._id,
            id,
            updatedData,
            pageIndex: activePageIndex,
            shape: "Pen",
          });
          dispatch(
            updateScribble({ id, updatedData, pageIndex: activePageIndex })
          );
        }
        break;
      }

      case "marker": {
        const mark = activePage.Markers.data.find((m) => m.id === id);
        if (mark) {
          const updatedData = {
            points: [...mark.data.points, x, y],
          };
          updateShape({
            roomKey: project.roomKey,
            projectId: project._id,
            id,
            updatedData,
            pageIndex: activePageIndex,
            shape: "Marker",
          });
          dispatch(
            updateMarker({ id, updatedData, pageIndex: activePageIndex })
          );
        }
        break;
      }

      case "circle": {
        const circle = activePage.Circles.data.find((c) => c.id === id);
        if (circle) {
          const radius = Math.sqrt((x - circle.data.x) ** 2 + (y - circle.data.y) ** 2);
          console.log(radius);
          const updatedData = {
            radius,
          };
          updateShape({
            roomKey: project.roomKey,
            projectId: project._id,
            id,
            updatedData,
            pageIndex: activePageIndex,
            shape: "Circle",
          });
          dispatch(
            updateCircle({ id, updatedData, pageIndex: activePageIndex })
          );
        }
        break;
      }

      case "ellipse": {
        const ellipse = activePage.Ellipses.data.find((e) => e.id === id);
        if (ellipse) {
          const updatedData = {
            radiusX: Math.abs(x - ellipse.data.x),
            radiusY: Math.abs(y - ellipse.data.y),
          };
          updateShape({
            roomKey: project.roomKey,
            projectId: project._id,
            id,
            updatedData,
            pageIndex: activePageIndex,
            shape: "Ellipse",
          });
          dispatch(
            updateEllipse({ id, updatedData, pageIndex: activePageIndex })
          );
        }
        break;
      }

      case "arrow": {
        const arrow = activePage.Arrows.data.find((a) => a.id === id);
        if (arrow) {
          const updatedPoints = [...arrow.data.points];
          updatedPoints[2] = x;
          updatedPoints[3] = y;
          const updatedData = {
            points: updatedPoints,
          };
          updateShape({
            roomKey: project.roomKey,
            projectId: project._id,
            id,
            updatedData,
            pageIndex: activePageIndex,
            shape: "Arrow",
          });
          dispatch(
            updateArrow({ id, updatedData, pageIndex: activePageIndex })
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
            {pages[activePageIndex]?.Rectangles.data.map((rectangle) => (
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
            {pages[activePageIndex]?.Scribbles.data.map((scribble) => (
              <Line
                key={scribble.id}
                points={scribble.data.points || []}
                stroke={scribble.data.color}
                strokeWidth={scribble.data.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                dash={scribble.data.dash}
              />
            ))}
            {pages[activePageIndex]?.Markers.data.map((mark) => (
              <Line
                key={mark.id}
                points={mark.data.points || []}
                stroke={mark.data.color}
                strokeWidth={mark.data.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
            {pages[activePageIndex]?.Circles.data.map((circle) => (
              <Circle
                key={circle.id}
                x={circle.data.x}
                y={circle.data.y}
                radius={circle.data.radius}
                stroke={circle.data.color}
                strokeWidth={circle.data.strokeWidth}
              />
            ))}
            {pages[activePageIndex]?.Ellipses.data.map((ellipse) => (
              <Ellipse
                key={ellipse.id}
                x={ellipse.data.x}
                y={ellipse.data.y}
                radiusX={ellipse.data.radiusX}
                radiusY={ellipse.data.radiusY}
                stroke={ellipse.data.color}
                strokeWidth={ellipse.data.strokeWidth}
                closed
              />
            ))}
            {pages[activePageIndex]?.Arrows.data.map((arrow) => (
              <Arrow
                key={arrow.id}
                points={arrow.data.points}
                pointerLength={8}
                pointerWidth={8}
                fill={arrow.data.color}
                stroke={arrow.data.color}
                strokeWidth={arrow.data.strokeWidth}
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
