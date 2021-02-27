import * as React from "react";
import { useDispatch } from "react-redux";

import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";

import {
  isDraggingNewNodeSelector,
  dragNewNodeTypeSelector,
  dragEndSelector,
} from "@/services/circuit-editor-ui-drag/selectors/drag";

import { fieldDragContinue } from "@/actions/field-drag-continue";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

import NodeVisual from "./NodeVisual";

const DragNewNodeLayer: React.FC = React.memo(function DragNewNodeLayer() {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();
  const isDraggingNewNode = useSelector(isDraggingNewNodeSelector);
  // FIXME: Apply snap if ctrl-meta not held
  const dragEnd = useSelector(dragEndSelector);
  const draggingNodeType = useSelector(dragNewNodeTypeSelector);

  // New node drags start on the tray, so we need to be responsible for
  // continuing the drag.
  const onMouseMove = React.useCallback(
    (e) => {
      const p = getMouseCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [getMouseCoords, dispatch]
  );

  if (!isDraggingNewNode || !draggingNodeType) {
    return null;
  }

  return (
    <>
      {dragEnd && (
        <g opacity={0.5}>
          <NodeVisual
            x={dragEnd.x}
            y={dragEnd.y}
            nodeType={draggingNodeType}
            nodeState={{}}
          />
        </g>
      )}
      <rect
        width="100%"
        height="100%"
        fill="transparent"
        onMouseMove={onMouseMove}
      />
    </>
  );
});

export default DragNewNodeLayer;
