import * as React from "react";
import { useDispatch } from "react-redux";

import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";

import { isDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";

import { circuitEditorDragContinue } from "@/actions/circuit-editor-drag-continue";
import { circuitEditorDragEnd } from "@/actions/circuit-editor-drag-end";
import { circuitEditorDragAbort } from "@/actions/circuit-editor-drag-abort";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

const EditorDragReceiver: React.FC = () => {
  const dispatch = useDispatch();

  const isDragging = useSelector(isDraggingSelector);

  console.log("drag receiver", isDragging);

  const getCoords = useEventMouseCoords();

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.buttons === 0) {
        // It would be nice if we could take a mouse capture and get notified
        // of the mouse up elsewhere, but we need to allow other circuit editors
        // to receive the mouse events so the drag can transfer.
        // As a second best, detect mouse up when it comes back into us and cancel.
        dispatch(circuitEditorDragAbort());
        return;
      }

      const coords = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(circuitEditorDragContinue(coords, modifierKeys));
    },
    [dispatch, getCoords]
  );

  const onMouseUp = React.useCallback(
    (e: React.MouseEvent) => {
      const coords = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(circuitEditorDragEnd(coords, modifierKeys));
    },
    [dispatch, getCoords]
  );

  if (!isDragging) {
    return null;
  }

  return (
    <rect
      width="100%"
      height="100%"
      fill="transparent"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};

export default EditorDragReceiver;
