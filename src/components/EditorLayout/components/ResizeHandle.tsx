import * as React from "react";

import styled from "styled-components";

import { DraggableCore, DraggableData } from "react-draggable";

const DragHandleDiv = styled.div`
  width: 5px;
  height: 100%;
  background: black;
  flex: none;
`;

export interface ResizeHandleProps {
  onResize(delta: number): void;
}

type Props = ResizeHandleProps;
class ResizeHandle extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this._onDrag = this._onDrag.bind(this);
  }

  render() {
    return (
      <DraggableCore onDrag={this._onDrag}>
        <DragHandleDiv />
      </DraggableCore>
    );
  }

  private _onDrag(e: MouseEvent, d: DraggableData) {
    const { onResize } = this.props;
    onResize(d.deltaX);
  }
}
export default ResizeHandle;
