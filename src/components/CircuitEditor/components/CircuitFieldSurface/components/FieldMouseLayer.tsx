import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { getModifiers } from "@/modifier-keys";

import {
  isEditorDraggingSelector,
  selectionRectSelector,
} from "@/services/circuit-editor-drag/selectors/drag";

import { useContextMenu } from "@/components/ContextMenu";

import { clearSelection } from "@/actions/select-clear";
import { circuitEditorDragStartSelect } from "@/actions/circuit-editor-drag-start-select";

import { useViewportContext } from "../../../contexts/viewport-context";
import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import { useMouseCoords } from "../hooks/useMouseCoords";

import FieldContextMenu from "./FieldContextMenu";

const DragSelectLayer: React.FC = React.memo(function DragSelectLayer() {
  const dispatch = useDispatch();
  const { editorId } = useCircuitEditor();
  const { zoomFactor } = useViewportContext();

  const isDragging = useSelector((state) =>
    isEditorDraggingSelector(state, editorId)
  );

  const selectionRect = useSelector(selectionRectSelector);

  function counterScale(value: number) {
    return value * (1 / zoomFactor);
  }

  const getCoords = useMouseCoords();

  const { openContextMenu, renderContextMenu } = useContextMenu();

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
    (e: MouseEvent, originalPoint: Point) => {
      const p = getCoords(originalPoint);
      const modifierKeys = getModifiers(e);
      dispatch(circuitEditorDragStartSelect(p, modifierKeys, editorId));
    },
    [dispatch, editorId, getCoords]
  );

  const { startTracking: onMouseDown } = useMouseDragDetector({
    onClick,
    onDragStart,
  });

  return (
    <g className="circuit-editor-mouse-layer">
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
        onContextMenu={onContextMenu}
      />
      {isDragging && selectionRect && (
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
      {renderContextMenu(({ point }) => (
        <FieldContextMenu fieldPosition={getCoords(point)} />
      ))}
    </g>
  );
});

export default DragSelectLayer;
