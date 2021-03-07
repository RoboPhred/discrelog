import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { interactNode } from "@/actions/node-interact";

import { ToggleElementState } from "@/elements/definitions/input-toggle";

import { editingCircuitNodeIdPathSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";

import { NodeComponentProps, NodeDefinition } from "../../types";

import styles from "./Interaction.module.css";
import { nodeOutputsFromCircuitNodeIdSelector } from "@/services/simulator/selectors/nodes";

const ToggleElementComponent = ({
  circuitNodeId,
  elementState,
}: NodeComponentProps<ToggleElementState>) => {
  const dispatch = useDispatch();
  const editCircuitIdPath = useSelector(editingCircuitNodeIdPathSelector);

  const circuitIdPath = React.useMemo(
    () => [...editCircuitIdPath, circuitNodeId ?? "~~none"],
    [editCircuitIdPath, circuitNodeId]
  );

  // FIXME: Should get the circuit path from props, to prepare for multiple field windows.
  const outputs = useSelector((state) =>
    nodeOutputsFromCircuitNodeIdSelector(state, circuitIdPath)
  );

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactNode(circuitIdPath));
    },
    [circuitIdPath, circuitNodeId, dispatch]
  );

  let onColor = "darkgreen";
  let onTextColor = "lightgrey";
  if (outputs) {
    if (outputs.OUT) {
      onColor = "lightgreen";
      onTextColor = "black";
    }
  }

  return (
    <g onClick={onClick} className={styles["node-interaction-toggle"]}>
      <rect
        className="node-select-highlight--stroke node-select-highlight--fill"
        x={5}
        y={5}
        width={40}
        height={40}
        stroke="black"
        fill="#AFAFAF"
        strokeWidth={1}
      />

      <circle cx={25} cy={25} r={16} fill={onColor} />

      <text
        x={25}
        y={25}
        fontSize=".8em"
        fill={onTextColor}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        On
      </text>
    </g>
  );
};
const toggleElementDefinition: NodeDefinition = {
  type: "interaction-momentary",
  category: "i/o",
  displayName: "Momentary Switch",
  elementProduction: "input-momentary",
  visual: {
    hitRect: {
      p1: { x: 5, y: 5 },
      p2: { x: 45, y: 45 },
    },
    component: ToggleElementComponent,
  },
  pins: {
    OUT: {
      direction: "output",
      x: 45,
      y: 25,
    },
  },
};

export default toggleElementDefinition;
