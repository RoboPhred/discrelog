import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { nodePinPositionFromNodePinSelector } from "@/services/circuit-layout/selectors/node-positions";
import { selectedPinSelector } from "@/pages/CircuitEditor/components/CircuitFieldView/components/CircuitField/selectors";

import { selectPin } from "../../actions/select-pin";

import styles from "./NodePin.module.css";
import { pinDirectionFromNodePinSelector } from "@/services/circuit-graph/selectors/pins";
import { Point } from "@/geometry";

export interface NodePinProps {
  nodeId: string;
  pinId: string;
}

const NodePin: React.FC<NodePinProps> = ({ nodeId, pinId }) => {
  const dispatch = useDispatch();
  const selectedPin = useSelector(selectedPinSelector);
  const position = useSelector((s) =>
    nodePinPositionFromNodePinSelector(s, nodeId, pinId)
  );
  const direction = useSelector((s) =>
    pinDirectionFromNodePinSelector(s, nodeId, pinId)
  );

  const isSelected =
    selectedPin != null &&
    selectedPin.nodeId === nodeId &&
    selectedPin.pinId === pinId;

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(selectPin(nodeId, pinId));
    },
    [nodeId, pinId]
  );

  if (!position) {
    return null;
  }

  const { x, y } = position;

  if (direction === "input") {
    return (
      <path
        d={describeArc(x, y, 5, -135 + 90, 135 + 90)}
        className={cls(
          styles["node-pin-input"],
          isSelected && styles["selected"]
        )}
        onMouseDown={onMouseDown}
      />
    );
  }

  return (
    <circle
      className={cls(
        styles["node-pin-output"],
        isSelected && styles["selected"]
      )}
      cx={x}
      cy={y}
      r={isSelected ? 6 : 3}
      onMouseDown={onMouseDown}
    />
  );
};

export default NodePin;

// Arc code from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): Point {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
