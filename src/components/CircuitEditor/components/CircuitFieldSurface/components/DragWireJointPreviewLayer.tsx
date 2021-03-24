import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { dragWireJointPositionSelector } from "@/services/circuit-editor-drag/selectors/drag-wire";

const DragWireJointPreviewLayer: React.FC = () => {
  const jointPos = useSelector(dragWireJointPositionSelector);

  if (!jointPos) {
    return null;
  }

  // FIXME: Use css for opacity on all dragging elements.
  return (
    <g className="circuit-editor-new-joint-layer">
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

export default DragWireJointPreviewLayer;
