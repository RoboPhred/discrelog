import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import {
  isDraggingNewNodeSelector,
  dragNewNodeTypeSelector,
  dragEndSelector
} from "@/services/field/selectors/drag";
import {
  fieldWidthSelector,
  fieldHeightSelector
} from "@/services/field/selectors/bounds";

import { fieldDragContinue } from "@/actions/field-drag-continue";

import { useEventMouseCoords } from "../hooks/useMouseCoords";
import NodeVisual from "@/pages/CircuitEditor/components/NodeVisual";

const DragNewNodeLayer: React.FC = () => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();
  const width = useSelector(state => fieldWidthSelector(state));
  const height = useSelector(state => fieldHeightSelector(state));
  const isDraggingNewNode = useSelector(state =>
    isDraggingNewNodeSelector(state)
  );
  const dragEnd = useSelector(state => dragEndSelector(state));
  const draggingNodeType = useSelector(state => dragNewNodeTypeSelector(state));

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      const p = getMouseCoords(e);
      dispatch(fieldDragContinue(p));
    },
    [getMouseCoords]
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
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={onMouseMove}
      />
    </>
  );
};

export default DragNewNodeLayer;
