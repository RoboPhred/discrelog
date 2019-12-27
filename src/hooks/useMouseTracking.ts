import * as React from "react";
import { ZeroPoint, pointSubtract } from "@/geometry";
import { Point } from "@/types";

export interface UseMouseTracking {
  startTracking(e: React.MouseEvent): void;
  cancelTracking(): void;
}

export interface MouseTrackingOptions {
  dragThreshold?: number;
  onClick?(e: MouseEvent): void;
  onDragStart?(e: MouseEvent): void;
  onDragMove?(offset: Point, e: MouseEvent): void;
  onDragEnd?(offset: Point, e: MouseEvent): void;
}

export default function useMouseTracking(
  opts: MouseTrackingOptions
): UseMouseTracking {
  const {
    dragThreshold = 5,
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd
  } = opts;

  const [isTracking, setTracking] = React.useState(false);
  const isDraggingRef = React.useRef(false);
  const mouseDownRef = React.useRef<Point>(ZeroPoint);

  const startTracking = React.useCallback(
    (e: React.MouseEvent) => {
      if (isTracking) {
        return;
      }

      setTracking(true);
      mouseDownRef.current = { x: e.pageX, y: e.pageY };
    },
    [isTracking]
  );

  const cancelTracking = React.useCallback(() => {
    setTracking(false);
    isDraggingRef.current = false;
    mouseDownRef.current = ZeroPoint;
  }, []);

  React.useEffect(() => {
    if (!isTracking) {
      return;
    }

    function onMouseMove(e: MouseEvent) {
      if (isDraggingRef.current) {
        if (onDragMove) {
          const offset = pointSubtract(
            { x: e.pageX, y: e.pageY },
            mouseDownRef.current
          );
          onDragMove(offset, e);
        }
      } else {
        const d = mouseDownRef.current;
        if (
          Math.abs(d.x - e.pageX) >= dragThreshold ||
          Math.abs(d.y - e.pageY) >= dragThreshold
        ) {
          isDraggingRef.current = true;
          if (onDragStart) {
            onDragStart(e);
          }
        }
      }
    }

    function onMouseUp(e: MouseEvent) {
      if (isDraggingRef.current) {
        if (onDragEnd) {
          const offset = pointSubtract(
            { x: e.pageX, y: e.pageY },
            mouseDownRef.current
          );
          onDragEnd(offset, e);
        }
      } else {
        if (onClick) {
          onClick(e);
        }
      }

      cancelTracking();
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTracking]);

  return {
    startTracking,
    cancelTracking
  };
}
