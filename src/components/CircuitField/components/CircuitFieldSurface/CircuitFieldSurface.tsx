import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDrop } from "react-dnd";

import { fieldMouseLeave } from "@/actions/field-mouse-leave";

import { viewScaleSelector } from "@/services/circuit-editor-ui-viewport/selectors/view";

import { NEW_NODE_DRAG_OBJECT } from "../../drag-items/new-node";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

import DragNewNodeLayer from "./components/DragNewNodeLayer";
import DragNodePreviewLayer from "./components/DragNodePreviewLayer";
import DragJointPreviewLayer from "./components/DragJointPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import GridBackground from "./components/GridBackground";
import NodesLayer from "./components/NodesLayer";
import WiresLayer from "./components/WiresLayer";
import NodePinsLayer from "./components/NodePinsLayer";
import DragAttachWirePreviewLayer from "./components/DragAttachWirePreviewLayer";

import styles from "./CircuitFieldSurface.module.css";

export interface CircuitFieldSurfaceProps {
  width: number;
  height: number;
  onContextMenu(e: React.MouseEvent): void;
}
const CircuitFieldSurface: React.FC<CircuitFieldSurfaceProps> = ({
  width,
  height,
  onContextMenu: openContextMenu,
}) => {
  const dispatch = useDispatch();

  const viewScale = useSelector(viewScaleSelector);

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const scalerRef = React.useRef<SVGGElement | null>(null);

  const onMouseDown = React.useCallback(() => {
    svgRef.current?.focus();
  }, []);

  const onMouseLeave = React.useCallback(() => {
    dispatch(fieldMouseLeave());
  }, [dispatch]);

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      openContextMenu(e);
    },
    [openContextMenu]
  );

  // We need to capture the drag event at a deeper parent,
  // because mouse events cannot pass through DragNewNodeLayer's
  // drag capture rect to the underlying DragSelectLayer and other elements.
  // In contrast, we cannot handle the drag here as
  // we do not know the coordinate system from our scaler.
  // Instead, just capture whether or not we are being dragged into,
  // and enable the new node drag layer only when we are dragging.
  const [{ isDragging }, dragRef] = useDrop({
    accept: NEW_NODE_DRAG_OBJECT,
    collect: (monitor) => {
      return {
        isDragging: monitor.isOver(),
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
      onContextMenu={onContextMenu}
      className={styles["circuit-field-svg"]}
    >
      <GridBackground />
      <g
        ref={scalerRef}
        transform-origin="0 0"
        transform={`scale(${viewScale})`}
      >
        <FieldSvgElementProvider svgRef={svgRef} scalerRef={scalerRef}>
          <DragSelectLayer />
          <NodesLayer />
          <WiresLayer />
          <NodePinsLayer />
          <DragAttachWirePreviewLayer />
          <DragNodePreviewLayer />
          <DragJointPreviewLayer />
          {isDragging && <DragNewNodeLayer />}
        </FieldSvgElementProvider>
      </g>
    </svg>
  );
};

export default CircuitFieldSurface;
