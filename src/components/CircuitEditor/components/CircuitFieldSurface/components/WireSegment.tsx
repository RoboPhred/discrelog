import * as React from "react";
import { useDispatch } from "react-redux";

import {
  Point,
  normalize,
  pointSubtract,
  dotProduct,
  pointAdd,
  scale,
} from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";

import { circuitEditorDragStartNewJoint } from "@/actions/circuit-editor-drag-start-newjoint";
import { circuitEditorDragContinue } from "@/actions/circuit-editor-drag-continue";
import { circuitEditorDragEnd } from "@/actions/circuit-editor-drag-end";
import { selectWires } from "@/actions/select-wires";

import {
  wireJointPositionFromJointIdSelector,
  wireStartPositionFromConnectionIdSelector,
  wireEndPositionFromConnectionIdSelector,
} from "@/services/node-layout/selectors/wires";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { isDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";

import { useEventMouseCoords, useMouseCoords } from "../hooks/useMouseCoords";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

export interface WireSegmentProps {
  connectionId: string;
  startJointId: string | null;
  endJointId: string | null;
}
const WireSegment: React.FC<WireSegmentProps> = React.memo(
  function WireSegment({ connectionId, startJointId, endJointId }) {
    const dispatch = useDispatch();
    const getMouseCoords = useMouseCoords();
    const isSimActive = useSelector(isSimActiveSelector);
    const isDragging = useSelector(isDraggingSelector);

    const start = useSelector((state) => {
      if (startJointId == null) {
        return wireStartPositionFromConnectionIdSelector(state, connectionId);
      }
      return wireJointPositionFromJointIdSelector(state, startJointId);
    });

    const end = useSelector((state) => {
      if (endJointId == null) {
        return wireEndPositionFromConnectionIdSelector(state, connectionId);
      }
      return wireJointPositionFromJointIdSelector(state, endJointId);
    });

    const [mousePos, setMousePos] = React.useState<Point | null>(null);

    const onMouseMove = React.useCallback(
      (e: React.MouseEvent) => {
        const p = getMouseCoords({ x: e.pageX, y: e.pageY });
        setMousePos(p);
      },
      [getMouseCoords]
    );

    const onMouseLeave = React.useCallback(() => {
      setMousePos(null);
    }, []);

    const onDragStart = React.useCallback(
      (e: MouseEvent, origionalPoint: Point) => {
        const p = getMouseCoords(origionalPoint);
        const modifiers = getModifiers(e);
        dispatch(
          circuitEditorDragStartNewJoint(
            connectionId,
            startJointId,
            p,
            modifiers
          )
        );
      },
      [getMouseCoords, dispatch, connectionId, startJointId]
    );

    const onClick = React.useCallback(
      (e: MouseEvent) => {
        const modifiers = getModifiers(e);
        const mode = getSelectMode(modifiers);
        dispatch(selectWires(connectionId, mode));
      },
      [connectionId, dispatch]
    );

    const { startTracking } = useMouseDragDetector({ onClick, onDragStart });

    const onJointInsertMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        if (isSimActive) {
          return;
        }

        startTracking(e);
      },
      [isSimActive, startTracking]
    );

    let insertJointPos: Point | undefined;
    if (!isDragging && !isSimActive && mousePos) {
      const lineDir = normalize(pointSubtract(end, start));
      const v = pointSubtract(mousePos, start);
      const d = dotProduct(v, lineDir);
      insertJointPos = pointAdd(start, scale(lineDir, d));
    }

    return (
      <g onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} strokeWidth={2} />
        {endJointId == null && <circle cx={end.x} cy={end.y} r={1.5} />}
        {insertJointPos && (
          <circle
            cx={insertJointPos.x}
            cy={insertJointPos.y}
            r={3}
            stroke="none"
            fill="red"
            onMouseDown={onJointInsertMouseDown}
          />
        )}
      </g>
    );
  }
);

export default WireSegment;
