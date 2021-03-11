import * as React from "react";
import { useDispatch } from "react-redux";

import interaction from "@/styles/interaction.module.css";

import { interactNode } from "@/actions/node-interact";

import { ToggleElementState } from "@/elements/definitions/input-toggle";

import { NodeComponentProps, NodeDefinition } from "../../types";

import styles from "./Interaction.module.css";

const ToggleElementComponent = ({
  circuitNodeId,
  circuitNodePath,
  elementState,
}: NodeComponentProps<ToggleElementState>) => {
  const dispatch = useDispatch();

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!circuitNodeId) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactNode([...(circuitNodePath || []), circuitNodeId]));
    },
    [circuitNodeId, dispatch, circuitNodePath]
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
        className={interaction["text-unselectable"]}
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
        className={interaction["text-unselectable"]}
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
  category: "input-output",
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
