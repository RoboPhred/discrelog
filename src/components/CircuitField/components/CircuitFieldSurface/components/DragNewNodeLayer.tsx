import * as React from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { Point, snapPoint } from "@/geometry";

import useSelector from "@/hooks/useSelector";

import { addNode } from "@/actions/node-add";

import { nodeTypeToCircuitId } from "@/nodes/definitions/integrated-circuits/utils";

import { gridNodeSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";
import { circuitWouldRecurseSelector } from "@/services/circuits/selectors/circuits";

import {
  isNewNodeDragObject,
  NEW_NODE_DRAG_OBJECT,
} from "../../../drag-items/new-node";

import { useCircuitField } from "../../../circuit-field-context";

import { useMouseCoords } from "../hooks/useMouseCoords";

import NodeVisual from "./NodeVisual";

const DragNewNodeLayer: React.FC = React.memo(function DragNewNodeLayer() {
  const dispatch = useDispatch();
  const { circuitId } = useCircuitField();
  const snap = useSelector(gridNodeSnapSelector);
  const getMouseCoords = useMouseCoords();

  const [dragType, setDragType] = React.useState<string | null>(null);
  const [dragPos, setDragPos] = React.useState<Point | null>(null);

  const dropTargetWouldRecurse = useSelector((state) =>
    circuitWouldRecurseSelector(state, nodeTypeToCircuitId(dragType), circuitId)
  );

  const [, dropRef] = useDrop(
    {
      accept: NEW_NODE_DRAG_OBJECT,
      collect: (monitor) => {
        // We need to clear this out on mouse out
        if (!monitor.isOver()) {
          setDragPos(null);
          setDragType(null);
        }
      },
      hover: (item, monitor) => {
        if (!isNewNodeDragObject(item)) {
          setDragPos(null);
          setDragType(null);
          return;
        }

        const pos = monitor.getClientOffset();
        if (!pos) {
          return;
        }
        const coords = getMouseCoords({ x: pos.x, y: pos.y });
        setDragType(item.payload.nodeType);
        setDragPos(coords);
      },
      drop: (item, monitor) => {
        if (!isNewNodeDragObject(item)) {
          return;
        }

        if (dropTargetWouldRecurse) {
          return;
        }

        const pos = monitor.getClientOffset();
        if (!pos) {
          return;
        }
        const coords = getMouseCoords({ x: pos.x, y: pos.y });
        dispatch(
          addNode(item.payload.nodeType, circuitId, snapPoint(coords, snap))
        );
      },
    },
    [circuitId, getMouseCoords, snap, dropTargetWouldRecurse]
  );

  const snapDragPos = dragPos && snapPoint(dragPos, snap);

  return (
    <g id="drag-new-node-layer">
      {!dropTargetWouldRecurse && snapDragPos && dragType && (
        <g opacity={0.5}>
          <NodeVisual x={snapDragPos.x} y={snapDragPos.y} nodeType={dragType} />
        </g>
      )}
      {dropTargetWouldRecurse && (
        <g>
          <rect width="100%" height="100%" opacity={0.7} fill="black" />
          {/* FIXME: Should center this text in the screen viewport. */}
          <text x="100" y="25%" fill="white">
            The current circuit is already inside the dragged IC.
          </text>
        </g>
      )}
      <rect ref={dropRef} width="100%" height="100%" fill="transparent" />
    </g>
  );
});

export default DragNewNodeLayer;
