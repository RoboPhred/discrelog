import * as React from "react";

import styled from "styled-components";

import { DraggableCore, DraggableData } from "react-draggable";

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
      <DragHandleDiv />
    </DraggableCore>
  );
};
export default ResizeHandle;

const DragHandleDiv = styled.div`
  width: 5px;
  height: 100%;
  background: black;
  flex: none;
  cursor: ew-resize;
`;
