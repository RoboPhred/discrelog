import * as React from "react";
import { connect } from "react-redux";

import { Line, Circle, Group } from "react-konva";

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
  const targetDef = nodeDefsById(state)[targetNodeId];
  let sourceOffset = ZeroPoint;
  let targetOffset = ZeroPoint;
  let value = false;
  if (sourceDef) {
    if (sourceDef.outputs[sourcePin]) {
      sourceOffset = sourceDef.outputs[sourcePin];
    }
    value =
      state.services.simulator.nodeOutputValuesByNodeId[sourceNodeId][
        sourcePin
      ];
  }
  if (targetDef && targetDef.inputs[targetPin]) {
    targetOffset = targetDef.inputs[targetPin];
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
interface State {
  testPoint: Point | null;
}
class Wire extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      testPoint: null
    };

    this._onTestMouseMove = this._onTestMouseMove.bind(this);
    this._onTestMouseLeave = this._onTestMouseLeave.bind(this);
  }

  render() {
    const { start, end, value } = this.props;
    const { testPoint } = this.state;
    const points = getWirePoints(start, end);
    return (
      <Group>
        <Line points={points} stroke={value ? "green" : "black"} />
        {/* {testPoint && (
          <Circle x={testPoint.x} y={testPoint.y} radius={4} fill="yellow" />
        )}
        <Line
          points={points}
          stroke="transparent"
          strokeWidth={5}
          onMouseMove={this._onTestMouseMove}
          onMouseLeave={this._onTestMouseLeave}
        /> */}
      </Group>
    );
  }

  private _onTestMouseMove(e: KonvaMouseEvent) {
    this.setState({
      testPoint: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onTestMouseLeave() {
    this.setState({
      testPoint: null
    });
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
