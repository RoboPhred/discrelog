import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  dragJointGhostLinesSelector,
  dragWireJointPositionSelector,
  dragWireSegmentEndPositionSelector,
  dragWireSegmentStartPositionSelector,
} from "@/services/circuit-editor-drag/selectors/drag-wire";

const DragWirePreviewLayer: React.FC = () => {
  const jointPos = useSelector(dragWireJointPositionSelector);
  const dragStart = useSelector(dragWireSegmentStartPositionSelector);
  const dragEnd = useSelector(dragWireSegmentEndPositionSelector);

  const ghostLines = useSelector(dragJointGhostLinesSelector);

  const ghostLineElements = ghostLines.map(([start, end], i) => (
    <line
      key={i}
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="black"
      strokeWidth={2}
      opacity={0.4}
    />
  ));

  if (!dragStart && !dragEnd && !jointPos && ghostLineElements.length === 0) {
    return null;
  }

  // FIXME: Use css for opacity on all dragging elements.
  return (
    <g className="circuit-editor-drag-wire-preview">
      {ghostLineElements}
      {jointPos && (
        <circle
          cx={jointPos.x}
          cy={jointPos.y}
          r={2}
          opacity={0.4}
          stroke="none"
          fill="black"
        />
      )}
      {dragStart && dragEnd && (
        <line
          x1={dragStart.x}
          y1={dragStart.y}
          x2={dragEnd.x}
          y2={dragEnd.y}
          stroke="black"
          strokeWidth={2}
          opacity={0.4}
        />
      )}
    </g>
  );
};

export default DragWirePreviewLayer;
