import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";
import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useMouseTracking from "@/hooks/useMouseTracking";

import {
  isDragForCircuitSelector,
  selectionRectSelector,
} from "@/services/circuit-editor-drag/selectors/drag";

import { clearSelection } from "@/actions/select-clear";
import { circuitEditorDragStartSelect } from "@/actions/circuit-editor-drag-start-select";
import { circuitEditorDragContinue } from "@/actions/circuit-editor-drag-continue";
import { circuitEditorDragEnd } from "@/actions/circuit-editor-drag-end";

import { useViewportContext } from "../../../contexts/viewport-context";
import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

const DragSelectLayer: React.FC = React.memo(function DragSelectLayer() {
  const dispatch = useDispatch();
  const { circuitId } = useCircuitEditor();
  const { zoomFactor } = useViewportContext();
  const isDragForSelf = useSelector((state) =>
    isDragForCircuitSelector(state, circuitId)
  );

  const selectionRect = useSelector(selectionRectSelector);

  function counterScale(value: number) {
    return value * (1 / zoomFactor);
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
      const modifierKeys = getModifiers(e);
      dispatch(circuitEditorDragStartSelect(p, modifierKeys, circuitId));
    },
    [circuitId, dispatch, getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(circuitEditorDragContinue(p, modifierKeys));
    },
    [dispatch, getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragEnd(p, modifiers));
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
        /*
         Our width and height get scaled by the parent scaler.
         We have to be inside the parent scaler to make our mouse coordinate values match up.
         Scale us back out so we continue to cover the whole screen.
         */
        width={`${counterScale(1) * 100}%`}
        height={`${counterScale(1) * 100}%`}
        fill="transparent"
        onMouseDown={onMouseDown}
      />
      {isDragForSelf && selectionRect && (
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
});

export default DragSelectLayer;
