import React from "react";
import { useDispatch } from "react-redux";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";

import { interactElement } from "@/actions/element-interact";

import { ElementComponentProps } from "@/elements/types";
import { elementOutputsFromCircuitElementIdSelector } from "@/services/simulator/selectors/elements";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import styles from "./element-visuals.module.css";

export const MomentaryInteractionElementVisual: React.FC<ElementComponentProps> = ({
  elementId,
  elementPath,
}) => {
  const dispatch = useDispatch();
  const isSimActive = useSelector(isSimActiveSelector);

  const circuitIdPath = React.useMemo(
    () => [...(elementPath || []), elementId ?? "~~none"],
    [elementPath, elementId]
  );

  const outputs = useSelector((state) =>
    elementOutputsFromCircuitElementIdSelector(state, circuitIdPath)
  );

  const onPress = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isSimActive) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      dispatch(interactElement(circuitIdPath, true));
    },
    [circuitIdPath, dispatch, isSimActive]
  );

  const onRelease = React.useCallback(() => {
    if (!isSimActive) {
      return;
    }

    dispatch(interactElement(circuitIdPath, false));
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
      className={styles["element-interaction-toggle"]}
    >
      <rect
        className="element-select-highlight--stroke element-select-highlight--fill"
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
        dominantBaseline="middle"
      >
        Push
      </text>
    </g>
  );
};
