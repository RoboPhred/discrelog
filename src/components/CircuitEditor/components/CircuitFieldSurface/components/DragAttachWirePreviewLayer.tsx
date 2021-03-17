import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  dragEndSelector,
  dragModeSelector,
  dragStartSelector,
  isEditorDraggingSelector,
} from "@/services/circuit-editor-drag/selectors/drag";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

const DragAttachWirePreviewLayer: React.FC = React.memo(
  function DragAttachWirePreviewLayer() {
    const { editorId } = useCircuitEditor();

    const isEditorDragging = useSelector((state) =>
      isEditorDraggingSelector(state, editorId)
    );

    const dragMode = useSelector(dragModeSelector);
    const dragStart = useSelector(dragStartSelector);
    const dragEnd = useSelector(dragEndSelector);

    if (!isEditorDragging || dragMode != "wire" || !dragStart || !dragEnd) {
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
