import * as React from "react";
import { connect, useDispatch } from "react-redux";

import { AppState } from "@/store";

import { selectedPinSelector } from "@/pages/CircuitEditor/components/CircuitFieldView/components/CircuitField/selectors";
import useSelector from "@/hooks/useSelector";
import { selectPin } from "../actions/select-pin";

const PIN_CIRCLE_RADIUS_UNSELECTED = 4;
const PIN_CIRCLE_RADIUS_SELECTED = 6;

export interface CircuitNodePinProps {
  nodeId: string;
  pinId: string;
  x: number;
  y: number;
}

const CircuitNodePin: React.FC<CircuitNodePinProps> = ({
  nodeId,
  pinId,
  x,
  y
}) => {
  const dispatch = useDispatch();
  const selectedPin = useSelector(selectedPinSelector);
  const isSelected =
    selectedPin && selectedPin.nodeId === nodeId && selectedPin.pinId === pinId;

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(selectPin(nodeId, pinId));
    },
    [nodeId, pinId]
  );

  return (
    <circle
      cx={x}
      cy={y}
      r={isSelected ? PIN_CIRCLE_RADIUS_SELECTED : PIN_CIRCLE_RADIUS_UNSELECTED}
      fill={isSelected ? "yellow" : "blue"}
      onMouseDown={onMouseDown}
    />
  );
};

export default CircuitNodePin;
