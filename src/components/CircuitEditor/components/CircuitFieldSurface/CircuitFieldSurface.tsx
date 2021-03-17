import * as React from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { circuitEditorMouseLeave } from "@/actions/circuit-editor-mouse-leave";

import { NEW_NODE_DRAG_OBJECT } from "../../drag-items/new-node";
import { useViewportContext } from "../../contexts/viewport-context";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragNewNodeLayer from "./components/DragNewNodeLayer";
import DragNodePreviewLayer from "./components/DragNodePreviewLayer";
import DragJointPreviewLayer from "./components/DragJointPreviewLayer";
import FieldMouseLayer from "./components/FieldMouseLayer";
import GridBackground from "./components/GridBackground";
import NodesLayer from "./components/NodesLayer";
import WiresLayer from "./components/WiresLayer";
import NodePinsLayer from "./components/NodePinsLayer";
import DragAttachWirePreviewLayer from "./components/DragAttachWirePreviewLayer";
import EditorDragReceiver from "./components/EditorDragReceiver";

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
  // because mouse events cannot pass through DragNewNodeLayer's
  // drag capture rect to the underlying DragSelectLayer and other elements.
  // In contrast, we cannot handle the drag here as
  // we do not know the coordinate system from our scaler.
  // Instead, just capture whether or not we are being dragged into,
  // and enable the new node drag layer only when we are dragging.
  const [{ isDraggingNewNode }, dragRef] = useDrop({
    accept: NEW_NODE_DRAG_OBJECT,
    collect: (monitor) => {
      return {
        isDraggingNewNode: monitor.isOver(),
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
          <NodesLayer />
          <WiresLayer />
          <NodePinsLayer />
          <DragAttachWirePreviewLayer />
          <DragNodePreviewLayer />
          <DragJointPreviewLayer />
          {isDraggingNewNode && <DragNewNodeLayer />}
          <EditorDragReceiver />
        </FieldSvgElementProvider>
      </g>
    </svg>
  );
};

export default CircuitFieldSurface;
