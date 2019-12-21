import * as React from "react";

import { DraggableCore, DraggableData } from "react-draggable";

import styles from "./ResizeHandle.module.css";

export interface ResizeHandleProps {
  onResize(delta: number): void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const onDrag = React.useCallback(
    (_: any, d: DraggableData) => {
      onResize(d.deltaX);
    },
    [onResize]
  );

  return (
    <DraggableCore onDrag={onDrag}>
      <div className={styles["drag-handle"]} />
    </DraggableCore>
  );
};
export default ResizeHandle;
