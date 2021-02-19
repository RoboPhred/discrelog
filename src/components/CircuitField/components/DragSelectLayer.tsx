import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useMouseTracking from "@/hooks/useMouseTracking";

import { selectionRectSelector } from "@/services/circuit-editor-ui/selectors/drag";
import { viewScaleSelector } from "@/services/circuit-editor-view/selectors/view";

import { clearSelection } from "@/actions/select-clear";
import { fieldDragStartSelect } from "@/actions/field-drag-start-select";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

const DragSelectLayer: React.FC = () => {
  const dispatch = useDispatch();
  const selectionRect = useSelector(selectionRectSelector);

  const scale = useSelector(viewScaleSelector);
  function counterScale(value: number) {
    return value * (1 / scale);
  }

  const getCoords = useEventMouseCoords();

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
      const modifiers = getModifiers(e);
      if (!modifiers.ctrlMetaKey && !modifiers.shiftKey) {
        dispatch(clearSelection());
      }
    },
    [dispatch]
  );

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords(e);
      dispatch(fieldDragStartSelect(p));
    },
    [dispatch, getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [dispatch, getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
    },
    [dispatch, getCoords]
  );

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
  });
  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      startTracking(e);
    },
    [startTracking]
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
            strokeWidth={counterScale(2)}
            strokeDasharray={`${counterScale(5)} ${counterScale(3)}`}
            stroke="skyblue"
            fill="transparent"
          />
        </g>
      )}
    </g>
  );
};

export default DragSelectLayer;
