import { Point } from "@/geometry";
import { PinDirection } from "@/logic";
import * as React from "react";

import { NodeComponentProps, NodeVisualDefinition } from "../../types";

export interface IntegratedCircuitVisualProps extends NodeComponentProps {
  inputPinCount: number;
  outputPinCount: number;
}

function getBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}

const IntegratedCircuitVisual: React.FC<IntegratedCircuitVisualProps> = ({
  isSelected,
  inputPinCount,
  outputPinCount,
}) => {
  const borderPath = getBorderPath(inputPinCount, outputPinCount);
  return (
    <g>
      <path
        stroke={isSelected ? "goldenrod" : "black"}
        fill="none"
        d={borderPath}
      />
    </g>
  );
};

export default IntegratedCircuitVisual;

export function circuitToNodeVisual(
  inputPinCount: number,
  outputPinCount: number
): NodeVisualDefinition {
  return {
    hitPath: getBorderPath(inputPinCount, outputPinCount),
    component: (props) => (
      <IntegratedCircuitVisual
        inputPinCount={inputPinCount}
        outputPinCount={outputPinCount}
        {...props}
      />
    ),
  };
}

export function circuitPinPosition(
  pinIndex: number,
  direction: PinDirection
): Point {
  return {
    x: direction === "input" ? 5 : 95,
    y: pinIndex * 50 + 25,
  };
}
