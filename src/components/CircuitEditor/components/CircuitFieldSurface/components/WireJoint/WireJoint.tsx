import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { getModifiers } from "@/modifier-keys";
import { describeArc } from "@/svg";

import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";
import useSelector from "@/hooks/useSelector";
import { getSelectMode } from "@/selection-mode";

import { circuitEditorDragStartWireJoint } from "@/actions/circuit-editor-drag-start-wire-joint";
import { selectWireJoints } from "@/actions/select-wire-joints";
import { circuitEditorDragStartWire } from "@/actions/circuit-editor-drag-start-wire";

import { wireJointPositionFromJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { isJointDragWireTarget } from "@/services/circuit-editor-drag/selectors/drag-wire";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { getWireJointHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./WireJoint.module.css";

export interface WireJointProps {
  wireId: string;
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = ({ wireId, jointId }) => {
  const dispatch = useDispatch();
  const { editorId } = useCircuitEditor();
  const getCoords = useMouseCoords();
  const isSimActive = useSelector(isSimActiveSelector);

  const position = useSelector((state) =>
    wireJointPositionFromJointIdSelector(state, jointId)
  );
  const isSelected = useSelector((state) =>
    isJointSelectedFromJointIdSelector(state, jointId)
  );
  const isDragTargetJoint = useSelector((state) =>
    isJointDragWireTarget(state, jointId)
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
        circuitEditorDragStartWireJoint(
          p,
          wireId,
          jointId,
          modifierKeys,
          editorId
        )
      );
    },
    [dispatch, editorId, getCoords, jointId, wireId]
  );

  const onNewSegmentMouseDown = (e: React.MouseEvent) => {
    const p = getCoords({ x: e.pageX, y: e.pageY });
    const modifierKeys = getModifiers(e);
    dispatch(
      circuitEditorDragStartWire(
        p,
        {
          type: "joint",
          jointId,
        },
        modifierKeys,
        editorId
      )
    );
  };

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      const modifierKeys = getModifiers(e);
      const selectionMode = getSelectMode(modifierKeys);
      dispatch(selectWireJoints(jointId, selectionMode));
    },
    [dispatch, jointId]
  );

  const { startTracking } = useMouseDragDetector({
    onDragStart,
    onClick,
  });

  const newSegmentArc = `${describeArc(
    position.x,
    position.y,
    8.5,
    0,
    180
  )} ${describeArc(position.x, position.y, 8.5, 180, 0)} z ${describeArc(
    position.x,
    position.y,
    5,
    0,
    180
  )} ${describeArc(position.x, position.y, 5, 180, 0)}`;

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
        r={6}
        fill="transparent"
        stroke="none"
      />
      <circle
        className={cls(isDragTargetJoint && styles["is-drag-target"])}
        cx={position.x}
        cy={position.y}
        r={3}
        fill="black"
        stroke="none"
      />
      {!isSimActive && !isDragTargetJoint && (mouseOver || isSelected) && (
        <g
          className={cls(
            styles["wire-joint--interactor"],
            isSelected && styles["selected"]
          )}
        >
          {mouseOver && (
            <g onMouseDown={onNewSegmentMouseDown}>
              <circle
                cx={position.x}
                cy={position.y}
                r={8.5}
                stroke="none"
                fill="transparent"
                className={styles["mouse-detector"]}
              />
              <path
                shapeRendering="geometricPrecision"
                stroke="none"
                fill="black"
                fillRule="evenodd"
                d={newSegmentArc}
              />
            </g>
          )}
          <circle
            cx={position.x}
            cy={position.y}
            r={3}
            fill="black"
            stroke="none"
            onMouseDown={startTracking}
          />
        </g>
      )}
    </g>
  );
};

export default WireJoint;
