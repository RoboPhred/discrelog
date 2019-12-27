import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Point } from "@/types";
import { pointAdd, ZeroPoint } from "@/geometry";

import useMouseTracking from "@/hooks/useMouseTracking";

import { getModifiers, getSelectMode } from "../selection-mode";

import { selectionRectSelector } from "../selectors";

import { dragStartSelect } from "../actions/drag-start-select";
import { useEventMouseCoords } from "../hooks/useMouseCoords";
import { dragContinue } from "../actions/drag-continue";
import { dragEnd } from "../actions/drag-end";

const DragSelectLayer: React.FC = () => {
  const dispatch = useDispatch();
  const selectionRect = useSelector(selectionRectSelector);

  const getCoords = useEventMouseCoords();

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords(e);
      dispatch(dragStartSelect(p));
    },
    [getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      dispatch(dragContinue(p));
    },
    [getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(dragEnd(p, mode));
    },
    [getCoords]
  );

  const { startTracking } = useMouseTracking({
    onDragStart,
    onDragMove,
    onDragEnd
  });
  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startTracking(e);
    },
    [getCoords]
  );

  return (
    <g id="drag-select-layer">
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        onMouseDown={onMouseDown}
      />
      {selectionRect && (
        <g
          transform={`translate(${selectionRect.p1.x}, ${selectionRect.p1.y})`}
        >
          <rect
            width={selectionRect.p2.x - selectionRect.p1.x}
            height={selectionRect.p2.y - selectionRect.p1.y}
            fill="blue"
          />
        </g>
      )}
    </g>
  );
};

export default DragSelectLayer;
