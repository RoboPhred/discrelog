import * as React from "react";
import { useDispatch } from "react-redux";
import getBounds from "svg-path-bounds";

import { boundsToRect, Point } from "@/geometry";
import { PinDirection } from "@/logic";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { viewCircuit } from "@/actions/circuit-view";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";
import { editingCircuitNodeIdPathSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";

import { NodeComponentProps, NodeVisualDefinition } from "../../types";

export interface IntegratedCircuitVisualProps {
  circuitId: string;
  inputPinCount: number;
  outputPinCount: number;
}

function getBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}

const IntegratedCircuitVisual: React.FC<
  IntegratedCircuitVisualProps & NodeComponentProps
> = ({ circuitNodeId, circuitId, inputPinCount, outputPinCount }) => {
  const dispatch = useDispatch();
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );
  const borderPath = getBorderPath(inputPinCount, outputPinCount);

  const editCircuitIdPath = useSelector(editingCircuitNodeIdPathSelector);

  const onViewCircuit = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      dispatch(viewCircuit(circuitId, [...editCircuitIdPath, circuitNodeId]));
    },
    [circuitId, circuitNodeId, dispatch, editCircuitIdPath]
  );

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
        className="node-select-highlight--stroke node-select-highlight--fill"
        stroke="black"
        fill="transparent"
        d={borderPath}
        onDoubleClick={onViewCircuit}
      />
      <text
        className={interaction["text-unselectable"]}
        textAnchor="middle"
        x={50}
        y={30}
      >
        {circuitName}
      </text>
      {inputPins}
      {outputPins}
    </g>
  );
};

const IntegratedCircuitTrayVisual: React.FC<IntegratedCircuitVisualProps> = () => {
  return (
    <g stroke="black" strokeWidth={1}>
      <rect x={10} y={10} width={30} height={30} fill="none" />

      <line x1={10} y1={15} x2={5} y2={15} />
      <line x1={40} y1={15} x2={45} y2={15} />

      <line x1={10} y1={35} x2={5} y2={35} />
      <line x1={40} y1={35} x2={45} y2={35} />
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
    hitRect: boundsToRect(
      getBounds(getBorderPath(inputPinCount, outputPinCount))
    ),
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
