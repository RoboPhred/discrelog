import React from "react";
import { useDispatch } from "react-redux";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { interactNode } from "@/actions/node-interact";

import { NodeComponentProps } from "@/nodes/types";
import { nodeOutputsFromCircuitNodeIdSelector } from "@/services/simulator/selectors/nodes";

import styles from "./node-visuals.module.css";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

export const MomentaryInteractionNode: React.FC<NodeComponentProps> = ({
  circuitNodeId,
  circuitNodePath,
}) => {
  const dispatch = useDispatch();
  const isSimActive = useSelector(isSimActiveSelector);

  const circuitIdPath = React.useMemo(
    () => [...(circuitNodePath || []), circuitNodeId ?? "~~none"],
    [circuitNodePath, circuitNodeId]
  );

  const outputs = useSelector((state) =>
    nodeOutputsFromCircuitNodeIdSelector(state, circuitIdPath)
  );

  const onPress = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isSimActive) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      dispatch(interactNode(circuitIdPath, true));
    },
    [circuitIdPath, dispatch, isSimActive]
  );

  const onRelease = React.useCallback(() => {
    if (!isSimActive) {
      return;
    }

    dispatch(interactNode(circuitIdPath, false));
  }, [circuitIdPath, dispatch, isSimActive]);

  let onColor = "darkgreen";
  let onTextColor = "lightgrey";
  if (outputs) {
    if (outputs.OUT) {
      onColor = "lightgreen";
      onTextColor = "black";
    }
  }

  return (
    <g
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      className={styles["node-interaction-toggle"]}
    >
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

      <line x1={45} y1={25} x2={50} y2={25} stroke="black" strokeWidth={2} />

      <circle cx={25} cy={25} r={17} fill={onColor} />

      <text
        className={interaction["text-unselectable"]}
        x={25}
        y={25}
        fontSize=".8em"
        fill={onTextColor}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Push
      </text>
    </g>
  );
};
