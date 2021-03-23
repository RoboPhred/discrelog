import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { describeArc } from "@/svg";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { elementPinPositionFromElementPinSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";
import { dragDropTargetPinSelector } from "@/services/circuit-editor-drag/selectors/drag-connection";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { getElementPinHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./ElementPin.module.css";
import { circuitEditorDragStartWire } from "@/actions/circuit-editor-drag-start-wire";
import { getModifiers } from "@/modifier-keys";

export interface ElementPinProps {
  elementId: string;
  pinId: string;
}

const ElementPin: React.FC<ElementPinProps> = React.memo(function ElementPin({
  elementId,
  pinId,
}) {
  const { editorId } = useCircuitEditor();
  const getMouseCoords = useMouseCoords();
  const [highlight, setHighlight] = React.useState(false);
  const dispatch = useDispatch();

  const position = useSelector((s) =>
    elementPinPositionFromElementPinSelector(s, elementId, pinId)
  );
  const direction = useSelector((s) =>
    pinDirectionFromElementPinSelector(s, elementId, pinId)
  );

  const dragTargetPin = useSelector(dragDropTargetPinSelector);

  const onDragStart = React.useCallback(
    (e, originalPoint) => {
      const p = getMouseCoords(originalPoint);
      const modifierKeys = getModifiers(e);
      dispatch(
        //circuitEditorDragStartConnection(p, { elementId, pinId }, editorId)
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

  if (!position) {
    return null;
  }

  const isDragTarget =
    dragTargetPin != null &&
    dragTargetPin.elementId === elementId &&
    dragTargetPin.pinId === pinId;

  const { x, y } = position;

  let pinVisual: JSX.Element;

  if (direction === "input") {
    pinVisual = (
      <path
        d={describeArc(x, y, 4, -45, 225)}
        strokeWidth={2}
        className={cls(
          styles["element-pin-input"],
          isDragTarget && styles["is-drag-target"],
          highlight && styles.highlight
        )}
      />
    );
  } else {
    pinVisual = (
      <circle
        className={cls(
          styles["element-pin-output"],
          isDragTarget && styles["is-drag-target"],
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
    </g>
  );
});

export default ElementPin;
