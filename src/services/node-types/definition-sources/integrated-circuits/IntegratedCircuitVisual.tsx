import * as React from "react";

import { Point } from "@/geometry";
import { PinDirection } from "@/logic";

import useSelector from "@/hooks/useSelector";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";

import { NodeVisualDefinition } from "../../types";

export interface IntegratedCircuitVisualProps {
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

const IntegratedCircuitTrayVisual: React.FC<IntegratedCircuitVisualProps> = ({
  circuitId,
}) => {
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );
  return (
    <g>
      <text textAnchor="middle" x={25} y={10}>
        {circuitName}
      </text>
      <g stroke="black" strokeWidth={1}>
        <rect x={10} y={20} width={30} height={30} fill="transparent" />
        <line x1={10} y1={25} x2={5} y2={25} />
        <line x1={40} y1={25} x2={45} y2={25} />

        <line x1={10} y1={45} x2={5} y2={45} />
        <line x1={40} y1={45} x2={45} y2={45} />
      </g>
    </g>
  );
};

export function circuitToNodeVisual(
  circuitId: string,
  inputPinCount: number,
  outputPinCount: number
): NodeVisualDefinition {
  const icProps: IntegratedCircuitVisualProps = {
    circuitId,
    inputPinCount,
    outputPinCount,
  };

  return {
    hitPath: getBorderPath(inputPinCount, outputPinCount),
    trayComponent: (props) => (
      <IntegratedCircuitTrayVisual {...icProps} {...props} />
    ),
    component: (props) => <IntegratedCircuitVisual {...icProps} {...props} />,
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
