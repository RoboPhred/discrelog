import * as React from "react";
import { useDispatch } from "react-redux";

import sizing from "@/styles/sizing.module.css";

import { Point, SelectionMode } from "@/types";

import { interactNode } from "@/actions/node-interact";

import { selectNodes } from "@/actions/select-nodes";
import { selectWires } from "@/actions/select-wires";
import { clearSelection } from "@/actions/select-clear";

import { dragStartNode } from "./actions/drag-start-node";
import { dragStartSelect } from "./actions/drag-start-select";
import { dragContinue } from "./actions/drag-continue";
import { dragEnd } from "./actions/drag-end";
import { selectPin } from "./actions/select-pin";

import { FieldSvgElementProvider } from "./contexts/fieldSvgElement";

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
  const mouseDownWireIdRef = React.useRef<string | null>(null);

  const resetMouseTracking = () => {
    mouseDownNodeIdRef.current = null;
    mouseDownPinIdRef.current = null;
    mouseDownWireIdRef.current = null;
  };

  const onClick = React.useCallback(
    (p: Point, modifiers: ModifierKeys) => {
      const selectMode = getSelectMode(modifiers);

      if (mouseDownWireIdRef.current) {
        dispatch(selectWires(mouseDownWireIdRef.current, selectMode));
        resetMouseTracking();
        return;
      }

      if (mouseDownNodeIdRef.current) {
        // Might want to make this into an action/reducer pair to complement the others.
        if (modifiers.altKey) {
          dispatch(interactNode(mouseDownNodeIdRef.current));
          resetMouseTracking();
          return;
        }

        dispatch(selectNodes(mouseDownNodeIdRef.current, selectMode));
        resetMouseTracking();
        return;
      }

      dispatch(clearSelection());
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

  const onWireMouseDown = React.useCallback(
    (wireId: string, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      mouseDownWireIdRef.current = wireId;
    },
    []
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
      <FieldSvgElementProvider value={svgRef}>
        <DragSelectLayer />
        <DragPreviewLayer />
        <WiresLayer onWireMouseDown={onWireMouseDown} />
        <NodesLayer
          onNodeMouseDown={onNodeMouseDown}
          onNodePinMouseDown={onNodePinMouseDown}
          onNodePinMouseUp={onNodePinMouseUp}
        />
      </FieldSvgElementProvider>
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
