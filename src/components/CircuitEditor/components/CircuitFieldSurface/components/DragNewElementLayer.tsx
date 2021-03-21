import * as React from "react";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { Point, snapPoint } from "@/geometry";

import useSelector from "@/hooks/useSelector";

import { addElement } from "@/actions/element-add";

import { elementTypeToCircuitId } from "@/elements/definitions/integrated-circuits/utils";

import { gridElementSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";
import { circuitWouldRecurseSelector } from "@/services/circuits/selectors/circuits";

import {
  isNewElementDragObject,
  NEW_ELEMENT_DRAG_OBJECT,
} from "../../../drag-items/new-element";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";
import { useViewportContext } from "../../../contexts/viewport-context";

import { useMouseCoords } from "../hooks/useMouseCoords";

import ElementVisual from "./ElementVisual";

const DragNewElementLayer: React.FC = React.memo(
  function DragNewElementLayer() {
    const dispatch = useDispatch();
    const { circuitId } = useCircuitEditor();
    const snap = useSelector(gridElementSnapSelector);
    const getMouseCoords = useMouseCoords();
    const { zoomFactor } = useViewportContext();

    function counterScale(value: number) {
      return value * (1 / zoomFactor);
    }

    const [dragType, setDragType] = React.useState<string | null>(null);
    const [dragPos, setDragPos] = React.useState<Point | null>(null);

    const dropTargetWouldRecurse = useSelector((state) =>
      circuitWouldRecurseSelector(
        state,
        elementTypeToCircuitId(dragType),
        circuitId
      )
    );

    const [, dropRef] = useDrop(
      {
        accept: NEW_ELEMENT_DRAG_OBJECT,
        collect: (monitor) => {
          // We need to clear this out on mouse out
          if (!monitor.isOver()) {
            setDragPos(null);
            setDragType(null);
          }
        },
        hover: (item, monitor) => {
          if (!isNewElementDragObject(item)) {
            setDragPos(null);
            setDragType(null);
            return;
          }

          const pos = monitor.getClientOffset();
          if (!pos) {
            return;
          }
          const coords = getMouseCoords({ x: pos.x, y: pos.y });
          setDragType(item.payload.elementType);
          setDragPos(coords);
        },
        drop: (item, monitor) => {
          if (!isNewElementDragObject(item)) {
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
            addElement(
              item.payload.elementType,
              circuitId,
              snapPoint(coords, snap)
            )
          );
        },
      },
      [circuitId, getMouseCoords, snap, dropTargetWouldRecurse]
    );

    const snapDragPos = dragPos && snapPoint(dragPos, snap);

    const counterScaledSize = `${counterScale(1) * 100}%`;

    return (
      <g id="drag-new-element-layer">
        {!dropTargetWouldRecurse && snapDragPos && dragType && (
          <g opacity={0.5}>
            <ElementVisual
              x={snapDragPos.x}
              y={snapDragPos.y}
              elementType={dragType}
            />
          </g>
        )}
        {dropTargetWouldRecurse && (
          <g transform={`scale(${counterScale(1)})`}>
            <rect width="100%" height="100%" opacity={0.7} fill="black" />
            {/* FIXME: Should center this text in the screen viewport. */}
            <text x="100" y="25%" fill="white">
              The current circuit is already inside the dragged IC.
            </text>
          </g>
        )}
        <rect
          ref={dropRef}
          width={counterScaledSize}
          height={counterScaledSize}
          fill="transparent"
        />
      </g>
    );
  }
);

export default DragNewElementLayer;
