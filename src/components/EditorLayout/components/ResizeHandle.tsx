import * as React from "react";
import { createUseStyles } from "react-jss";

import { DraggableCore, DraggableData } from "react-draggable";

export interface ResizeHandleProps {
  onResize(delta: number): void;
}

const useStyles = createUseStyles({
  dragHandle: {
    width: "5px",
    height: "100%",
    background: "black",
    cursor: "ew-resize"
  }
})

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onResize }) => {
  const styles = useStyles();
  const onDrag = React.useCallback(
    (_: any, d: DraggableData) => {
      onResize(d.deltaX);
    },
    [onResize]
  );

  return (
    <DraggableCore onDrag={onDrag}>
      <div className={styles.dragHandle} />
    </DraggableCore>
  );
};
export default ResizeHandle;
