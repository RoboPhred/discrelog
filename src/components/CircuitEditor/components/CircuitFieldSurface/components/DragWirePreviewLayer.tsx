import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  dragWireSegmentEndPositionSelector,
  dragWireSegmentStartPositionSelector,
} from "@/services/circuit-editor-drag/selectors/drag-wire";

const DragWirePreviewLayer: React.FC = () => {
  const dragStart = useSelector(dragWireSegmentStartPositionSelector);
  const dragEnd = useSelector(dragWireSegmentEndPositionSelector);

  if (!dragStart || !dragEnd) {
    return null;
  }

  return (
    <g className="circuit-editor-drag-node-preview">
      <line
        x1={dragStart.x}
        y1={dragStart.y}
        x2={dragEnd.x}
        y2={dragEnd.y}
        stroke="black"
        strokeWidth={2}
        opacity={0.4}
      />
    </g>
  );
};

export default DragWirePreviewLayer;
