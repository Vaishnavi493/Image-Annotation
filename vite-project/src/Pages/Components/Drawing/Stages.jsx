import React, { useRef, useState, useEffect } from "react";
import { Group, Layer, Rect, Stage, Text } from "react-konva";
import KonvaImage from "../image/Konvaimage";
import toast from "react-hot-toast";

function Stages({ imageSrc, color, action, annotations, onAnnotationUpdate }) {
  const stageRef = useRef();
  const [rectangles, setRectangles] = useState(annotations);
  const selectedImage_ID = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const isPainting = useRef(false);
  const moved = useRef(false);

  useEffect(() => {
    // Sync annotations from props to local state
    setRectangles(annotations);
  }, [annotations, imageSrc]);

  function onMouseDown() {
    if (!action) {
      toast.error("Select a type of bounding box");
      return;
    }

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = Math.random(); // Unique ID
    selectedImage_ID.current = id;
    isPainting.current = true;

    setRectangles((prevRectangles) => [
      ...prevRectangles,
      {
        id,
        x,
        y,
        width: 0,
        height: 0,
        color,
        annotation: "",
        edit: false,
      },
    ]);
  }

  function onMouseMove() {
    if (!action || !isPainting.current) return;
    moved.current = true;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    setRectangles((prevRectangles) =>
      prevRectangles.map((rectangle) => {
        if (rectangle.id === selectedImage_ID.current) {
          return {
            ...rectangle,
            width: x - rectangle.x,
            height: y - rectangle.y,
          };
        }
        return rectangle;
      })
    );
  }

  function onPointerUp() {
    if (moved.current) {
      const annotation = prompt("Enter annotation text:");
      if (annotation !== null) {
        const updatedRectangles = rectangles.map((rectangle) =>
          rectangle.id === selectedImage_ID.current
            ? { ...rectangle, annotation, edit: true }
            : rectangle
        );
        setRectangles(updatedRectangles);
        console.log("Rectangle Finalized:", updatedRectangles.find(r => r.id === selectedImage_ID.current)); // Log finalized rectangle details
        onAnnotationUpdate(updatedRectangles);

    
      }
    }

    isPainting.current = false;
    moved.current = false;
  }

//   function handleEdit(id) {
//     const annotation = prompt("Edit annotation:");
//     if (annotation !== null) {
//       const updatedRectangles = rectangles.map((rectangle) =>
//         rectangle.id === id ? { ...rectangle, annotation } : rectangle
//       );
//       setRectangles(updatedRectangles);
//       onAnnotationUpdate(updatedRectangles);
//     }
//   }

//   function handleDelete(id) {
//     const updatedRectangles = rectangles.filter(
//       (rectangle) => rectangle.id !== id
//     );
//     setRectangles(updatedRectangles);
//     onAnnotationUpdate(updatedRectangles);
//   }

function handleEdit(id) {
    const annotation = prompt("Edit annotation:");
    if (annotation !== null) {
      const updatedRectangles = rectangles.map((rectangle) =>
        rectangle.id === id ? { ...rectangle, annotation } : rectangle
      );
      setRectangles(updatedRectangles);
      onAnnotationUpdate(updatedRectangles);
    }
  }

  function handleDelete(id) {
    const updatedRectangles = rectangles.filter(
      (rectangle) => rectangle.id !== id
    );
    setRectangles(updatedRectangles);
    onAnnotationUpdate(updatedRectangles);
  }



  return (
    <>
      {imageSrc && (
        <Stage
          ref={stageRef}
          width={imageSrc.width}
          height={imageSrc.height}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onPointerUp}
          className="border-2 bg-red-500 overflow-hidden"
        >
          <Layer>
            <KonvaImage image={imageSrc} />
            {rectangles.map((rectangle) => (
              <Group
                key={rectangle.id}
                onMouseEnter={() => setHoveredId(rectangle.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Rect
                  x={rectangle.x}
                  y={rectangle.y}
                  strokeWidth={2}
                  height={rectangle.height}
                  width={rectangle.width}
                  stroke={rectangle.color}
                />
                {rectangle.annotation && (
                  <Text
                    x={rectangle.x}
                    y={rectangle.y - 20}
                    text={rectangle.annotation}
                    fontSize={16}
                    fill={rectangle.color}
                  />
                )}
                {hoveredId === rectangle.id && rectangle.edit && (
                  <>
                    <Text
                      x={rectangle.x}
                      y={rectangle.y + rectangle.height - 10}
                      text="Edit"
                      fontSize={15}
                      fill="blue"
                      onClick={() => handleEdit(rectangle.id)}
                      cursor="pointer"
                    />
                    <Text
                      x={rectangle.x + 40}
                      y={rectangle.y + rectangle.height - 10}
                      text="Delete"
                      fontSize={15}
                      fill="red"
                      onClick={() => handleDelete(rectangle.id)}
                      cursor="pointer"
                    />
                  </>
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
      )}
    </>
  );
}

export default Stages;
