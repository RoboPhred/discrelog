import * as React from "react";
import { useDispatch } from "react-redux";
import getBounds from "svg-path-bounds";

import { boundsToRect, Point } from "@/geometry";
import { PinDirection } from "@/logic";
import { cls } from "@/utils";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { viewCircuit } from "@/actions/view-circuit";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";
import { nodeNamesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import { useTesselPath } from "@/components/Tessel/TesselContext";

import { NodeComponentProps, NodeVisualDefinition } from "../../types";

function getBorderPath(inputPinCount: number, outputPinCount: number) {
  const height = Math.max(inputPinCount, outputPinCount, 1) * 50 - 20;
  return `M10,10 h80 v${height} h-80 z`;
}

export interface IntegratedCircuitVisualProps {
  circuitId: string;
  inputPinIds: string[];
  outputPinIds: string[];
}

const IntegratedCircuitVisual: React.FC<
  IntegratedCircuitVisualProps & NodeComponentProps
> = ({
  circuitNodeId,
  circuitNodePath,
  circuitId,
  inputPinIds,
  outputPinIds,
}) => {
  const dispatch = useDispatch();
  // TODO: Now that we are relying on components being in a tessel path, we
  // definitely should move node components into children of CircuitEditor
  // and connect to them from node-types using ids.
  // More practically: this should ignore tessel path and instead rely on ui-layout
  // to open us up in the last interacted with view.
  const tesselPath = useTesselPath();
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );

  const nodeNamesById = useSelector(nodeNamesByNodeIdSelector);

  const borderPath = getBorderPath(inputPinIds.length, outputPinIds.length);

  const onViewCircuit = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      dispatch(
        viewCircuit(circuitId, [...(circuitNodePath || []), circuitNodeId], {
          tesselPath,
        })
      );
    },
    [circuitNodeId, dispatch, circuitId, circuitNodePath, tesselPath]
  );

  const inputPins = inputPinIds.map((pinId, i) => {
    const y = i * 50 + 25;
    return (
      <g key={pinId}>
        <line
          className="node-select-highlight--stroke"
          stroke="black"
          strokeWidth={2}
          x1={0}
          y1={y}
          x2={10}
          y2={y}
        />
        <text
          className={interaction["text-unselectable"]}
          x={15}
          y={y}
          alignmentBaseline="middle"
          fontSize=".7em"
        >
          {nodeNamesById[pinId]}
        </text>
      </g>
    );
  });

  const outputPins = outputPinIds.map((pinId, i) => {
    const y = i * 50 + 25;
    return (
      <g key={pinId}>
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
        <text
          className={interaction["text-unselectable"]}
          x={85}
          y={y}
          textAnchor="end"
          alignmentBaseline="middle"
          fontSize=".7em"
        >
          {nodeNamesById[pinId]}
        </text>
      </g>
    );
  });

  return (
    <g>
      <text
        className={cls(
          interaction["text-unselectable"],
          "node-select-highlight--fill"
        )}
        textAnchor="middle"
        x={50}
        y={0}
      >
        {circuitName}
      </text>
      <path
        className="node-select-highlight--stroke node-select-highlight--fill"
        stroke="black"
        fill="transparent"
        d={borderPath}
        onDoubleClick={onViewCircuit}
      />
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
  inputPinIds: string[],
  outputPinIds: string[]
): NodeVisualDefinition {
  const icProps: IntegratedCircuitVisualProps = {
    circuitId,
    inputPinIds,
    outputPinIds,
  };

  return {
    hitRect: boundsToRect(
      getBounds(getBorderPath(inputPinIds.length, outputPinIds.length))
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
