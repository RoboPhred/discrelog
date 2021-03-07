import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { interactNode } from "@/actions/node-interact";

import { ToggleElementState } from "@/elements/definitions/input-toggle";

import { editingCircuitNodeIdPathSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";

import { NodeComponentProps, NodeDefinition } from "../../types";

import styles from "./Interaction.module.css";

const ToggleElementComponent = ({
  circuitNodeId,
  elementState,
}: NodeComponentProps<ToggleElementState>) => {
  const dispatch = useDispatch();
  const editCircuitIdPath = useSelector(editingCircuitNodeIdPathSelector);

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactNode([...editCircuitIdPath, circuitNodeId]));
    },
    [circuitNodeId, dispatch, editCircuitIdPath]
  );

  let onColor = "darkgreen";
  let onTextColor = "lightgrey";
  let offColor = "darkred";
  if (elementState) {
    const { toggleState } = elementState;
    if (toggleState) {
      onColor = "lightgreen";
      onTextColor = "black";
    } else {
      offColor = "red";
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
      <rect
        x={10}
        y={10}
        width={30}
        height={15}
        strokeWidth={0}
        fill={onColor}
      />
      <text
        x={25}
        y={19}
        fontSize=".8em"
        fill={onTextColor}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        On
      </text>
      <rect
        x={10}
        y={25}
        width={30}
        height={15}
        strokeWidth={0}
        fill={offColor}
      />
      <text
        x={25}
        y={34}
        fontSize=".8em"
        fill="lightgrey"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Off
      </text>
    </g>
  );
};
const toggleElementDefinition: NodeDefinition = {
  type: "interaction-toggle",
  category: "i/o",
  displayName: "Toggle Switch",
  elementProduction: "input-toggle",
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
