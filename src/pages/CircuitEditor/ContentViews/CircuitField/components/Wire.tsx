import * as React from "react";
import { connect } from "react-redux";

import { Line, Group } from "react-konva";

import { ZeroPoint, pointAdd } from "@/geometry";
import { AppState } from "@/store";
import { Point } from "@/types";

import { nodeDefsById } from "@/services/simulator/selectors";
import { NodePin } from "@/services/simulator/types";

import { nodePositionsById } from "@/pages/CircuitEditor/selectors";

export interface WireProps {
  source: NodePin;
  target: NodePin;
}

function mapStateToProps(state: AppState, props: WireProps) {
  const {
    source: { nodeId: sourceNodeId, pin: sourcePin },
    target: { nodeId: targetNodeId, pin: targetPin }
  } = props;

  const sourceDef = nodeDefsById(state)[sourceNodeId];
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

  const targetDef = nodeDefsById(state)[targetNodeId];
  let targetOffset = ZeroPoint;
  if (targetDef && targetDef.pins[targetPin]) {
    targetOffset = targetDef.pins[targetPin];
  }

  return {
    start: pointAdd(
      nodePositionsById(state)[sourceNodeId] || ZeroPoint,
      sourceOffset
    ),
    end: pointAdd(
      nodePositionsById(state)[targetNodeId] || ZeroPoint,
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
    const points = getWirePoints(start, end);
    return (
      <Group>
        <Line points={points} stroke={value ? "green" : "black"} />
      </Group>
    );
  }
}
export default connect(mapStateToProps)(Wire);

function getWirePoints(start: Point, end: Point): number[] {
  if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
    return [
      start.x,
      start.y,

      start.x + (end.x - start.x) / 2,
      start.y,

      start.x + (end.x - start.x) / 2,
      end.y,

      end.x,
      end.y
    ];
  } else {
    return [
      start.x,
      start.y,

      start.x,
      start.y + (end.y - start.y) / 2,

      end.x,
      start.y + (end.y - start.y) / 2,

      end.x,
      end.y
    ];
  }
}
