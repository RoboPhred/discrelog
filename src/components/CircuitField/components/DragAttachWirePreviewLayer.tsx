import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  dragEndSelector,
  dragModeSelector,
  dragStartSelector,
} from "@/services/circuit-editor-ui/selectors/drag";

const DragAttachWirePreviewLayer: React.FC = () => {
  const dragMode = useSelector(dragModeSelector);
  const dragStart = useSelector(dragStartSelector);
  const dragEnd = useSelector(dragEndSelector);

  if (dragMode != "wire" || !dragStart || !dragEnd) {
    return null;
  }

  return (
    <line
      x1={dragStart.x}
      y1={dragStart.y}
      x2={dragEnd.x}
      y2={dragEnd.y}
      stroke="black"
      strokeWidth={1}
    />
  );
};

export default DragAttachWirePreviewLayer;
