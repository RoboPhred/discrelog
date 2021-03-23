import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { dragWireSegmentNewJointPositionSelector } from "@/services/circuit-editor-drag/selectors/drag-wire";

const DragWireSegmentNewJointPreviewLayer: React.FC = () => {
  const jointPos = useSelector(dragWireSegmentNewJointPositionSelector);

  if (!jointPos) {
    return null;
  }

  // FIXME: Use css for opacity on all dragging elements.
  return (
    <g className="circuit-editor-wire-segment-new-joint-layer">
      <circle
        cx={jointPos.x}
        cy={jointPos.y}
        r={2}
        opacity={0.4}
        stroke="none"
        fill="black"
      />
    </g>
  );
};

export default DragWireSegmentNewJointPreviewLayer;
