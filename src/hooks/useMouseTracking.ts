import * as React from "react";
import { Point, ZeroPoint, pointSubtract } from "@/geometry";

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
    onDragEnd,
  } = opts;

  // We need both state and ref for this.
  //  State lets us trigger a rerender / useEffect.
  //  Ref lets us check for cancellation when handling document events.
  //  We seem to get a few rogue onMouseMove events after we try to stop tracking.
  const [isTracking, setTracking] = React.useState(false);
  const isTrackingRef = React.useRef(false);

  const isDraggingRef = React.useRef(false);
  const mouseDownRef = React.useRef<Point>(ZeroPoint);

  const startTracking = React.useCallback((e: React.MouseEvent) => {
    if (isTrackingRef.current) {
      return;
    }

    isTrackingRef.current = true;
    setTracking(true);
    mouseDownRef.current = { x: e.pageX, y: e.pageY };
  }, []);

  const cancelTracking = React.useCallback(() => {
    isTrackingRef.current = false;
    setTracking(false);
    isDraggingRef.current = false;
    mouseDownRef.current = ZeroPoint;
  }, []);

  React.useEffect(() => {
    if (!isTracking) {
      return;
    }

    function onMouseMove(e: MouseEvent) {
      if (!isTrackingRef.current) {
        return;
      }

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
      if (!isTrackingRef.current) {
        return;
      }

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
    cancelTracking,
  };
}
