import * as React from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { circuitEditorMouseLeave } from "@/actions/circuit-editor-mouse-leave";

import { NEW_ELEMENT_DRAG_OBJECT } from "../../drag-items/new-element";
import { useViewportContext } from "../../contexts/viewport-context";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragNewElementLayer from "./components/DragNewElementLayer";
import DragElementPreviewLayer from "./components/DragElementPreviewLayer";
import FieldMouseLayer from "./components/FieldMouseLayer";
import GridBackground from "./components/GridBackground";
import ElementsLayer from "./components/ElementsLayer";
import ElementPinsLayer from "./components/ElementPinsLayer";
import EditorDragReceiver from "./components/EditorDragReceiver";
import WiresLayer from "./components/WiresLayer";

import styles from "./CircuitFieldSurface.module.css";

export interface CircuitFieldSurfaceProps {
  width: number;
  height: number;
}
const CircuitFieldSurface: React.FC<CircuitFieldSurfaceProps> = ({
  width,
  height,
}) => {
  const dispatch = useDispatch();
  const { zoomFactor } = useViewportContext();

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const scalerRef = React.useRef<SVGGElement | null>(null);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  const onMouseLeave = React.useCallback(() => {
    dispatch(circuitEditorMouseLeave());
  }, [dispatch]);

  // We need to capture the drag event at a deeper parent,
  // because mouse events cannot pass through DragNewElementLayer's
  // drag capture rect to the underlying DragSelectLayer and other elements.
  // In contrast, we cannot handle the drag here as
  // we do not know the coordinate system from our scaler.
  // Instead, just capture whether or not we are being dragged into,
  // and enable the new element drag layer only when we are dragging.
  const [{ isDraggingNewElement }, dragRef] = useDrop({
    accept: NEW_ELEMENT_DRAG_OBJECT,
    collect: (monitor) => {
      return {
        isDraggingNewElement: monitor.isOver(),
      };
    },
  });

  return (
    <svg
      tabIndex={-1}
      ref={(ref) => {
        svgRef.current = ref;
        dragRef(ref);
      }}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      className={styles["circuit-field-svg"]}
    >
      <GridBackground />
      <g
        ref={scalerRef}
        transform-origin="0 0"
        transform={`scale(${zoomFactor})`}
      >
        <FieldSvgElementProvider svgRef={svgRef} scalerRef={scalerRef}>
          <FieldMouseLayer />
          <ElementsLayer />
          <WiresLayer />
          <ElementPinsLayer />
          <DragElementPreviewLayer />
          {isDraggingNewElement && <DragNewElementLayer />}
          <EditorDragReceiver />
        </FieldSvgElementProvider>
      </g>
    </svg>
  );
};

export default CircuitFieldSurface;
