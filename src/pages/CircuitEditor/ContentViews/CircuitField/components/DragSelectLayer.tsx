import * as React from "react";
import { connect } from "react-redux";

import { FastLayer, Rect } from "react-konva";

import { AppState } from "@/store";

import { selectionRectSelector } from "../selectors";

function mapStateToProps(state: AppState) {
  return {
    selectionRect: selectionRectSelector(state)
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps;
class DragSelectLayer extends React.Component<Props> {
  render() {
    const { selectionRect: rect } = this.props;
    return (
      <FastLayer>
        {rect && (
          <Rect
            x={rect.p1.x}
            y={rect.p1.y}
            width={rect.p2.x - rect.p1.x}
            height={rect.p2.y - rect.p1.y}
            fill="blue"
          />
        )}
      </FastLayer>
    );
  }
}
export default connect(mapStateToProps)(DragSelectLayer);
