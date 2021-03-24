import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { getModifiers } from "@/modifier-keys";

import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";
import useSelector from "@/hooks/useSelector";
import { getSelectMode } from "@/selection-mode";

import { circuitEditorDragStartWireJoint } from "@/actions/circuit-editor-drag-start-wire-joint";
import { selectJoints } from "@/actions/select-joints";

import { wireJointPositionFromJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { getWireJointHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./WireJoint.module.css";

export interface WireJointProps {
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = ({ jointId }) => {
  const dispatch = useDispatch();
  const { editorId } = useCircuitEditor();
  const getCoords = useMouseCoords();

  const position = useSelector((state) =>
    wireJointPositionFromJointIdSelector(state, jointId)
  );
  const isSelected = useSelector((state) =>
    isJointSelectedFromJointIdSelector(state, jointId)
  );

  const [mouseOver, setMouseOver] = React.useState(false);

  const onMouseOver = () => {
    setMouseOver(true);
  };

  const onMouseLeave = () => {
    setMouseOver(false);
  };

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords({ x: e.pageX, y: e.pageY });
      const modifierKeys = getModifiers(e);
      dispatch(
        circuitEditorDragStartWireJoint(p, jointId, modifierKeys, editorId)
      );
    },
    [dispatch, editorId, getCoords, jointId]
  );

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifierKeys = getModifiers(e);
      const selectionMode = getSelectMode(modifierKeys);
      dispatch(selectJoints(jointId, selectionMode));
    },
    [dispatch, jointId]
  );

  const { startTracking } = useMouseDragDetector({
    onDragStart,
    onClick,
  });

  if (!position) {
    return null;
  }

  return (
    <g
      id={getWireJointHtmlId(editorId, jointId)}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <circle
        cx={position.x}
        cy={position.y}
        r={4}
        fill="transparent"
        stroke="none"
      />
      {(mouseOver || isSelected) && (
        <circle
          className={cls(
            styles["wire-joint--interactor"],
            isSelected && styles["selected"]
          )}
          cx={position.x}
          cy={position.y}
          r={3}
          fill="black"
          stroke="none"
          onMouseDown={startTracking}
        />
      )}
    </g>
  );
};

export default WireJoint;
