import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import { viewCircuit } from "@/actions/view-circuit";

import useSelector from "@/hooks/useSelector";

import interaction from "@/styles/interaction.module.css";

import { circuitNameFromIdSelector } from "@/services/circuits/selectors/circuits";
import { elementNamesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { ElementComponentProps } from "@/elements/types";

import { getICBorderPath } from "@/elements/definitions/integrated-circuits/utils";

export interface IntegratedCircuitElementVisualProps {
  circuitId: string;
  inputPinIds: string[];
  outputPinIds: string[];
}

export const IntegratedCircuitElementVisual: React.FC<
  IntegratedCircuitElementVisualProps & ElementComponentProps
> = ({ elementId, elementPath, circuitId, inputPinIds, outputPinIds }) => {
  const dispatch = useDispatch();
  // TODO: Now that we are relying on components being in a tessel path, we
  // definitely should move element components into children of CircuitEditor
  // and connect to them from element-types using ids.
  // More practically: this should ignore tessel path and instead rely on ui-layout
  // to open us up in the last interacted with view.
  const circuitName = useSelector((state) =>
    circuitNameFromIdSelector(state, circuitId)
  );

  const elementNamesById = useSelector(elementNamesByElementIdSelector);

  const borderPath = getICBorderPath(inputPinIds.length, outputPinIds.length);

  const onViewCircuit = React.useCallback(
    (e: React.MouseEvent) => {
      if (!elementId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      dispatch(viewCircuit(circuitId, [...(elementPath || []), elementId]));
    },
    [elementId, dispatch, circuitId, elementPath]
  );

  const inputPins = inputPinIds.map((pinId, i) => {
    const y = i * 50 + 25;
    return (
      <g key={pinId}>
        <line
          className="element-select-highlight--stroke"
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
          {elementNamesById[pinId]}
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
          className="element-select-highlight--stroke"
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
          {elementNamesById[pinId]}
        </text>
      </g>
    );
  });

  return (
    <g>
      <text
        className={cls(
          interaction["text-unselectable"],
          "element-select-highlight--fill"
        )}
        textAnchor="middle"
        x={50}
        y={0}
      >
        {circuitName}
      </text>
      <path
        className="element-select-highlight--stroke element-select-highlight--fill"
        stroke="black"
        fill="white"
        d={borderPath}
        onDoubleClick={onViewCircuit}
      />
      {inputPins}
      {outputPins}
    </g>
  );
};
