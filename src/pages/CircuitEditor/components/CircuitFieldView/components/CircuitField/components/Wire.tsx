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

import { nodeDefsByIdSelector } from "@/services/graph/selectors/nodes";
import { wireByIdSelector } from "@/services/graph/selectors/connections";
import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";

import { useEventMouseCoords } from "../hooks/useMouseCoords";
import { selectedWireIdsSelector } from "@/services/selection/selectors/selection";

export interface WireProps {
  wireId: string;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
}

function mapStateToProps(state: AppState, props: WireProps) {
  const {
    inputPin: { nodeId: targetNodeId, pinId: targetPin },
    outputPin: { nodeId: sourceNodeId, pinId: sourcePin }
  } = wireByIdSelector(state, props.wireId);

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

  const selectedWires = selectedWireIdsSelector(state);
  const isSelected = selectedWires.indexOf(props.wireId) !== -1;

  return {
    start: pointAdd(
      nodePositionsByIdSelector(state)[sourceNodeId] || ZeroPoint,
      sourceOffset
    ),
    end: pointAdd(
      nodePositionsByIdSelector(state)[targetNodeId] || ZeroPoint,
      targetOffset
    ),
    isSelected,
    value
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps & WireProps;

const Wire: React.FC<Props> = ({
  start,
  end,
  isSelected,
  value,
  onMouseDown,
  onMouseUp
}) => {
  const getMouseCoords = useEventMouseCoords();

  const [mousePos, setMousePos] = React.useState<Point | null>(null);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      const p = getMouseCoords(e);
      setMousePos(p);
    },
    [getMouseCoords]
  );

  const onMouseOut = React.useCallback(() => {
    setMousePos(null);
  }, []);

  let color: string;
  if (isSelected) {
    color = "yellow";
  } else if (mousePos) {
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
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
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
