import * as React from "react";

import { Point } from "@/geometry";
import { PinDirection } from "@/logic";

import { NodeComponentProps, NodeVisualDefinition } from "../../types";
import useSelector from "@/hooks/useSelector";
import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

export interface IntegratedCircuitVisualProps extends NodeComponentProps {
  circuitId: string;
  inputPinCount: number;
  outputPinCount: number;
}

function getBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}

const IntegratedCircuitVisual: React.FC<IntegratedCircuitVisualProps> = ({
  circuitId,
  inputPinCount,
  outputPinCount,
}) => {
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );
  const borderPath = getBorderPath(inputPinCount, outputPinCount);

  const inputPins: JSX.Element[] = [];
  for (let i = 0; i < inputPinCount; i++) {
    const y = i * 50 + 25;
    inputPins.push(
      <line
        key={i}
        className="node-select-highlight--stroke"
        stroke="black"
        strokeWidth={2}
        x1={0}
        y1={y}
        x2={10}
        y2={y}
      />
    );
  }

  const outputPins: JSX.Element[] = [];
  for (let i = 0; i < outputPinCount; i++) {
    const y = i * 50 + 25;
    outputPins.push(
      <line
        key={i}
        className="node-select-highlight--stroke"
        stroke="black"
        strokeWidth={2}
        x1={90}
        y1={y}
        x2={100}
        y2={y}
      />
    );
  }

  return (
    <g>
      <path
        className="node-select-highlight--stroke"
        stroke="black"
        fill="none"
        d={borderPath}
      />
      <text textAnchor="middle" x={50} y={30}>
        {circuitName}
      </text>
      {inputPins}
      {outputPins}
    </g>
  );
};

export default IntegratedCircuitVisual;

export function circuitToNodeVisual(
  circuitId: string,
  inputPinCount: number,
  outputPinCount: number
): NodeVisualDefinition {
  return {
    hitPath: getBorderPath(inputPinCount, outputPinCount),
    component: (props) => (
      <IntegratedCircuitVisual
        circuitId={circuitId}
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
    x: direction === "input" ? 0 : 100,
    y: pinIndex * 50 + 25,
  };
}
