import * as React from "react";
import { connect } from "react-redux";

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
    if (!rect) {
      return null;
    }
    return (
      <g id="drag-select-layer" transform={`translate(${rect.p1.x}, ${rect.p1.y})`}>
        <rect
          width={rect.p2.x - rect.p1.x}
          height={rect.p2.y - rect.p1.y}

          fill="blue"
        />
      </g>
    );
  }
}
export default connect(mapStateToProps)(DragSelectLayer);
