import * as React from "react";
import { connect } from "react-redux";

import { ZeroPoint, pointAdd } from "@/geometry";
import { AppState } from "@/store";
import { Point } from "@/types";

import { NodePin } from "@/services/simulator/types";
import { nodeDefsByIdSelector } from "@/services/simulator/selectors/nodes";

import { nodePositionsByIdSelector } from "@/pages/CircuitEditor/selectors";

export interface WireProps {
  output: NodePin;
  input: NodePin;
}

function mapStateToProps(state: AppState, props: WireProps) {
  const {
    output: { nodeId: sourceNodeId, pinId: sourcePin },
    input: { nodeId: targetNodeId, pinId: targetPin }
  } = props;

  const sourceDef = nodeDefsByIdSelector(state)[sourceNodeId];
  let sourceOffset = ZeroPoint;
  let value = false;

  if (sourceDef) {
    if (sourceDef.pins[sourcePin]) {
      sourceOffset = sourceDef.pins[sourcePin];
    }
    value =
      state.services.simulator.nodeOutputValuesByNodeId[sourceNodeId][
      sourcePin
      ];
  }

  const targetDef = nodeDefsByIdSelector(state)[targetNodeId];
  let targetOffset = ZeroPoint;
  if (targetDef && targetDef.pins[targetPin]) {
    targetOffset = targetDef.pins[targetPin];
  }

  return {
    start: pointAdd(
      nodePositionsByIdSelector(state)[sourceNodeId] || ZeroPoint,
      sourceOffset
    ),
    end: pointAdd(
      nodePositionsByIdSelector(state)[targetNodeId] || ZeroPoint,
      targetOffset
    ),
    value
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WireProps;
class Wire extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      testPoint: null
    };
  }

  render() {
    const { start, end, value } = this.props;
    // TODO: Style lines again
    // const points = getWirePoints(start, end);
    return (
      <g>
        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={value ? "green" : "black"} />
      </g>
    );
  }
}
export default connect(mapStateToProps)(Wire);

// function getWirePoints(start: Point, end: Point): number[] {
//   if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
//     return [
//       start.x,
//       start.y,

//       start.x + (end.x - start.x) / 2,
//       start.y,

//       start.x + (end.x - start.x) / 2,
//       end.y,

//       end.x,
//       end.y
//     ];
//   } else {
//     return [
//       start.x,
//       start.y,

//       start.x,
//       start.y + (end.y - start.y) / 2,

//       end.x,
//       start.y + (end.y - start.y) / 2,

//       end.x,
//       end.y
//     ];
//   }
// }
