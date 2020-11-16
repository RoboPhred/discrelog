import * as React from "react";
import { useDispatch } from "react-redux";

import { calcSize } from "@/geometry";
import useSelector from "@/hooks/useSelector";

import {
  isDraggingNewNodeSelector,
  dragNewNodeTypeSelector,
  dragEndSelector,
} from "@/services/view/selectors/drag";

import { fieldRectSelector } from "@/services/node-layout/selectors/field";

import { fieldDragContinue } from "@/actions/field-drag-continue";

import ElementVisual from "@/pages/CircuitEditor/components/ElementVisual";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

const DragNewNodeLayer: React.FC = () => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();
  const fieldRect = useSelector(fieldRectSelector);
  const { width, height } = calcSize(fieldRect);
  const isDraggingNewNode = useSelector(isDraggingNewNodeSelector);
  const dragEnd = useSelector(dragEndSelector);
  const draggingNodeType = useSelector(dragNewNodeTypeSelector);

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
          <ElementVisual
            x={dragEnd.x}
            y={dragEnd.y}
            elementType={draggingNodeType}
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
