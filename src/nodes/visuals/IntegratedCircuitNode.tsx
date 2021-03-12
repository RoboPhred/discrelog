import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import { viewCircuit } from "@/actions/view-circuit";

import useSelector from "@/hooks/useSelector";

import interaction from "@/styles/interaction.module.css";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";
import { nodeNamesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { NodeComponentProps } from "@/nodes/types";

import { getICBorderPath } from "@/nodes/definitions/integrated-circuits/utils";

export interface IntegratedCircuitVisualProps {
  circuitId: string;
  inputPinIds: string[];
  outputPinIds: string[];
}

export const IntegratedCircuitVisual: React.FC<
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
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );

  const nodeNamesById = useSelector(nodeNamesByNodeIdSelector);

  const borderPath = getICBorderPath(inputPinIds.length, outputPinIds.length);

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
        viewCircuit(circuitId, [...(circuitNodePath || []), circuitNodeId])
      );
    },
    [circuitNodeId, dispatch, circuitId, circuitNodePath]
  );

  const inputPins = inputPinIds.map((pinId, i) => {
    const y = i * 50 + 25;
    return (
      <g key={pinId}>
        <line
          className="node-select-highlight--stroke"
          stroke="black"
          strokeWidth={2}
          x1={4}
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
