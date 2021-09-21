import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { describeArc } from "@/svg";
import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { useContextMenu } from "@/components/ContextMenu";

import { circuitEditorDragStartWire } from "@/actions/circuit-editor-drag-start-wire";

import { elementPinPositionFromElementPinSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";
import { isPinDragWireTarget } from "@/services/circuit-editor-drag/selectors/drag-wire";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { getElementPinHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import PinContextMenu from "../PinContextMenu";

import styles from "./ElementPin.module.css";

export interface ElementPinProps {
  elementId: string;
  pinId: string;
}

const ElementPin: React.FC<ElementPinProps> = React.memo(function ElementPin({
  elementId,
  pinId,
}) {
  const dispatch = useDispatch();

  const { editorId } = useCircuitEditor();
  const getMouseCoords = useMouseCoords();

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const [highlight, setHighlight] = React.useState(false);

  const position = useSelector((s) =>
    elementPinPositionFromElementPinSelector(s, elementId, pinId)
  );
  const direction = useSelector((s) =>
    pinDirectionFromElementPinSelector(s, elementId, pinId)
  );

  const isDragTargetPin = useSelector((state) =>
    isPinDragWireTarget(state, elementId, pinId)
  );

  const onDragStart = React.useCallback(
    (e, originalPoint) => {
      const p = getMouseCoords(originalPoint);
      const modifierKeys = getModifiers(e);
      dispatch(
        circuitEditorDragStartWire(
          p,
          { type: "pin", pin: { elementId, pinId } },
          modifierKeys,
          editorId
        )
      );
    },
    [dispatch, editorId, getMouseCoords, elementId, pinId]
  );

  const { startTracking } = useMouseDragDetector({
    onDragStart,
  });

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      e.stopPropagation();

      startTracking(e);
    },
    [startTracking]
  );

  const onMouseEnter = React.useCallback(() => {
    setHighlight(true);
  }, []);
  const onMouseLeave = React.useCallback(() => {
    setHighlight(false);
  }, []);

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      openContextMenu(e);
    },
    [openContextMenu]
  );

  if (!position) {
    return null;
  }

  const { x, y } = position;

  let pinVisual: JSX.Element;

  if (direction === "input") {
    pinVisual = (
      <path
        d={describeArc(x, y, 4, -45, 225)}
        strokeWidth={2}
        className={cls(
          styles["element-pin-input"],
          isDragTargetPin && styles["is-drag-target"],
          highlight && styles.highlight
        )}
      />
    );
  } else {
    pinVisual = (
      <circle
        className={cls(
          styles["element-pin-output"],
          isDragTargetPin && styles["is-drag-target"],
          highlight && styles.highlight
        )}
        cx={x}
        cy={y}
        r={3}
      />
    );
  }

  return (
    <g
      id={getElementPinHtmlId(editorId, elementId, pinId)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onContextMenu={onContextMenu}
    >
      {pinVisual}
      <circle
        stroke="none"
        fill="transparent"
        cx={x}
        cy={y}
        r={5}
        onMouseDown={onMouseDown}
      />
      {renderContextMenu(
        <PinContextMenu elementId={elementId} pinId={pinId} />
      )}
    </g>
  );
});

export default ElementPin;
