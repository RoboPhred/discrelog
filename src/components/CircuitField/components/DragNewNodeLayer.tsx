import * as React from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { Point, snapPoint } from "@/geometry";

import useSelector from "@/hooks/useSelector";

import { addNode } from "@/actions/node-add";

import { editingCircuitIdSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";
import { gridNodeSnapSelector } from "@/services/circuit-editor-ui-drag/selectors/snap";

import { useMouseCoords } from "../hooks/useMouseCoords";

import {
  isNewNodeDragObject,
  NEW_NODE_DRAG_OBJECT,
} from "../drag-items/new-node";

import NodeVisual from "./NodeVisual";

const DragNewNodeLayer: React.FC = React.memo(function DragNewNodeLayer() {
  const dispatch = useDispatch();
  const editingCircuitId = useSelector(editingCircuitIdSelector);
  const snap = useSelector(gridNodeSnapSelector);
  const getMouseCoords = useMouseCoords();

  const [dragType, setDragType] = React.useState<string | null>(null);
  const [dragPos, setDragPos] = React.useState<Point | null>(null);

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

        const pos = monitor.getClientOffset();
        if (!pos) {
          return;
        }
        const coords = getMouseCoords({ x: pos.x, y: pos.y });
        dispatch(
          addNode(item.payload.nodeType, {
            circuitId: editingCircuitId,
            position: snapPoint(coords, snap),
          })
        );
      },
    },
    [editingCircuitId, getMouseCoords, snap]
  );

  const snapDragPos = dragPos && snapPoint(dragPos, snap);

  return (
    <>
      {snapDragPos && dragType && (
        <g opacity={0.5}>
          <NodeVisual x={snapDragPos.x} y={snapDragPos.y} nodeType={dragType} />
        </g>
      )}
      <rect ref={dropRef} width="100%" height="100%" fill="transparent" />
    </>
  );
});

export default DragNewNodeLayer;
