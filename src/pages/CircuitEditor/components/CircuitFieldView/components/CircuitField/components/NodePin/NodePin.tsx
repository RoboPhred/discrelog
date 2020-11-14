import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { nodePinPositionFromNodePinSelector } from "@/services/field/selectors/positions";
import { selectedPinSelector } from "@/pages/CircuitEditor/components/CircuitFieldView/components/CircuitField/selectors";

import { selectPin } from "../../actions/select-pin";

import styles from "./NodePin.module.css";

const PIN_CIRCLE_RADIUS_UNSELECTED = 4;
const PIN_CIRCLE_RADIUS_SELECTED = 6;

export interface NodePinProps {
  nodeId: string;
  pinId: string;
}

const NodePin: React.FC<NodePinProps> = ({ nodeId, pinId }) => {
  const dispatch = useDispatch();
  const selectedPin = useSelector(selectedPinSelector);
  const position = useSelector((s) =>
    nodePinPositionFromNodePinSelector(s, nodeId, pinId)
  );

  const isSelected =
    selectedPin != null &&
    selectedPin.nodeId === nodeId &&
    selectedPin.pinId === pinId;

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(selectPin(nodeId, pinId));
    },
    [nodeId, pinId]
  );

  if (!position) {
    return null;
  }

  const { x, y } = position;

  return (
    <circle
      className={cls(styles["node-pin"], isSelected && styles["selected"])}
      cx={x}
      cy={y}
      r={isSelected ? PIN_CIRCLE_RADIUS_SELECTED : PIN_CIRCLE_RADIUS_UNSELECTED}
      onMouseDown={onMouseDown}
    />
  );
};

export default NodePin;
