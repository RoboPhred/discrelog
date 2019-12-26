import * as React from "react";
import { connect } from "react-redux";

import {
  ZeroPoint,
  pointAdd,
  normalize,
  pointSubtract,
  dotProduct,
  scale
} from "@/geometry";
import { AppState } from "@/store";
import { Point } from "@/types";

import { NodePin } from "@/services/graph/types";
import { nodeDefsByIdSelector } from "@/services/graph/selectors/nodes";

import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";

import { useMouseCoords } from "../hooks/useMouseCoords";

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

const Wire: React.FC<Props> = ({ start, end, value }) => {
  const getMouseCoords = useMouseCoords();
  const [mousePos, setMousePos] = React.useState<Point | null>(null);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      const p = getMouseCoords({ x: e.clientX, y: e.clientY });
      setMousePos(p);
    },
    [getMouseCoords]
  );

  const onMouseOut = React.useCallback(() => {
    setMousePos(null);
  }, []);

  let color: string;
  if (mousePos) {
    color = "orange";
  } else if (value) {
    color = "green";
  } else {
    color = "black";
  }

  let dotPos: Point | undefined;
  if (mousePos) {
    let lineDir = normalize(pointSubtract(end, start));
    const v = pointSubtract(mousePos, start);
    var d = dotProduct(v, lineDir);
    dotPos = pointAdd(start, scale(lineDir, d));
  }

  return (
    <g>
      <line
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={2}
      />
      {dotPos && (
        <circle
          pointerEvents="none"
          cx={dotPos.x}
          cy={dotPos.y}
          r={3}
          fill="red"
        />
      )}
    </g>
  );
};

export default connect(mapStateToProps)(Wire);
