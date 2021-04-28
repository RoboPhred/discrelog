import * as React from "react";
import { useDispatch } from "react-redux";

import interaction from "@/styles/interaction.module.css";

import { interactElement } from "@/actions/element-interact";

import { ElementComponentProps } from "@/elements/types";

import { ToggleEvolverState } from "@/evolvers/definitions/input-toggle";

import styles from "./element-visuals.module.css";

export const ToggleInteractionElementVisual: React.FC<ElementComponentProps<
  ToggleEvolverState
>> = ({ elementId, elementPath, evolverState }) => {
  const dispatch = useDispatch();

  const onClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!elementId) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      dispatch(interactElement([...(elementPath || []), elementId]));
    },
    [elementId, dispatch, elementPath]
  );

  let onColor = "darkgreen";
  let onTextColor = "lightgrey";
  let offColor = "darkred";
  if (evolverState) {
    const { toggleState } = evolverState;
    if (toggleState) {
      onColor = "lightgreen";
      onTextColor = "black";
    } else {
      offColor = "red";
    }
  }

  return (
    <g onClick={onClick} className={styles["element-interaction-toggle"]}>
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
        dominantBaseline="middle"
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
        dominantBaseline="middle"
      >
        Off
      </text>
    </g>
  );
};
