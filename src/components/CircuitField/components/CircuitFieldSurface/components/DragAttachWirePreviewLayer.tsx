import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  dragEndSelector,
  dragModeSelector,
  dragStartSelector,
  isDragForCircuitSelector,
} from "@/services/circuit-editor-drag/selectors/drag";

import { useCircuitField } from "../../../circuit-field-context";

const DragAttachWirePreviewLayer: React.FC = React.memo(
  function DragAttachWirePreviewLayer() {
    const { circuitId } = useCircuitField();
    const isDragForSelf = useSelector((state) =>
      isDragForCircuitSelector(state, circuitId)
    );
    const dragMode = useSelector(dragModeSelector);
    const dragStart = useSelector(dragStartSelector);
    const dragEnd = useSelector(dragEndSelector);

    if (!isDragForSelf || dragMode != "wire" || !dragStart || !dragEnd) {
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
  }
);

export default DragAttachWirePreviewLayer;
