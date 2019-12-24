import * as React from "react";
import { useDispatch } from "react-redux";

import sizing from "@/styles/sizing.module.css";

import { Point } from "@/types";

import { interactNode } from "@/actions/node-interact";

import { SelectionMode } from "@/pages/CircuitEditor/types";
import { nodeHover } from "@/pages/CircuitEditor/actions/node-hover";
import { selectNodes } from "@/pages/CircuitEditor/actions/select-nodes";
import { clearSelection } from "@/pages/CircuitEditor/actions/select-clear";

import { dragStartNode } from "./actions/drag-start-node";
import { dragStartSelect } from "./actions/drag-start-select";
import { dragContinue } from "./actions/drag-continue";
import { dragEnd } from "./actions/drag-end";
import { selectPin } from "./actions/select-pin";

import DragPreviewLayer from "./components/DragPreviewLayer";
import DragSelectLayer from "./components/DragSelectLayer";
import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

import useMouseTracking from "./useMouseTracking";
import { ModifierKeys } from "./types";

export interface CircuitFieldProps {}

const CircuitField: React.FC<CircuitFieldProps> = ({}) => {
  const dispatch = useDispatch();

  const svgRef = React.useRef<SVGSVGElement>(null);

  const mouseDownNodeIdRef = React.useRef<string | null>(null);
  const mouseDownPinIdRef = React.useRef<string | null>(null);

  const resetMouseTracking = () => {
    mouseDownNodeIdRef.current = null;
    mouseDownPinIdRef.current = null;
  };

  const onClick = React.useCallback(
    (p: Point, modifiers: ModifierKeys) => {
      if (mouseDownNodeIdRef.current) {
        // Might want to make this into an action/reducer pair to complement the others.
        if (modifiers.altKey) {
          return interactNode(mouseDownNodeIdRef.current);
        }

        const selectMode = getSelectMode(modifiers);
        dispatch(selectNodes(mouseDownNodeIdRef.current, selectMode));
      } else {
        dispatch(clearSelection());
      }

      resetMouseTracking();
    },
    [dispatch]
  );

  const onDragStart = React.useCallback(
    (p: Point, modifiers: ModifierKeys) => {
      if (mouseDownNodeIdRef.current) {
        const selectMode = getSelectMode(modifiers);
        dispatch(dragStartNode(mouseDownNodeIdRef.current, p, selectMode));
      } else {
        dispatch(dragStartSelect(p));
      }

      resetMouseTracking();
    },
    [dispatch]
  );

  const onDragContinue = React.useCallback(
    (p: Point) => {
      dispatch(dragContinue(p));
    },
    [dispatch]
  );

  const onDragEnd = React.useCallback(
    (p: Point, modifiers: ModifierKeys) => {
      const selectMode = getSelectMode(modifiers);
      dispatch(dragEnd(p, selectMode));
    },
    [dispatch]
  );

  const { onMouseDown, onMouseMove, onMouseUp, cancelDrag } = useMouseTracking(
    svgRef,
    onClick,
    onDragStart,
    onDragContinue,
    onDragEnd
  );

  const onNodeMouseDown = React.useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      mouseDownNodeIdRef.current = nodeId;
    },
    []
  );

  const onNodeMouseOver = React.useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      dispatch(nodeHover(nodeId));
    },
    [dispatch]
  );

  const onNodeMouseLeave = React.useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      dispatch(nodeHover(null));
    },
    [dispatch]
  );

  const onNodePinMouseDown = React.useCallback(
    (nodeId: string, pinId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      mouseDownNodeIdRef.current = nodeId;
      mouseDownPinIdRef.current = pinId;
      e.preventDefault();
    },
    []
  );

  const onNodePinMouseUp = React.useCallback(
    (nodeId: string, pinId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        resetMouseTracking();
        cancelDrag();
        return;
      }

      if (
        mouseDownNodeIdRef.current !== nodeId ||
        mouseDownPinIdRef.current !== pinId
      ) {
        resetMouseTracking();
        cancelDrag();
        return;
      }

      dispatch(selectPin(nodeId, pinId));
      resetMouseTracking();
      cancelDrag();
      e.preventDefault();
    },
    []
  );

  return (
    <svg
      className={sizing["fill-parent"]}
      tabIndex={-1}
      ref={svgRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <DragSelectLayer />
      <DragPreviewLayer />
      <WiresLayer />
      <NodesLayer
        onNodeMouseDown={onNodeMouseDown}
        onNodeMouseOver={onNodeMouseOver}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodePinMouseDown={onNodePinMouseDown}
        onNodePinMouseUp={onNodePinMouseUp}
      />
    </svg>
  );
};

export default CircuitField;

function getSelectMode(modifiers: ModifierKeys): SelectionMode {
  if (modifiers.shiftKey && modifiers.ctrlMetaKey) {
    return "remove";
  }
  if (modifiers.shiftKey) {
    return "append";
  }
  if (modifiers.ctrlMetaKey) {
    return "toggle";
  }
  return "set";
}
