import { Point } from "@/geometry";
import * as React from "react";

export interface UseMouseDragDetector {
  startTracking(e: React.MouseEvent): void;
}

export interface UseMouseDragDetectorOpts {
  dragThreshold?: number;
  onClick?(e: MouseEvent): void;
  onDragStart?(e: MouseEvent, originalCoords: Point): void;
}
export function useMouseDragDetector({
  dragThreshold = 5,
  onClick,
  onDragStart,
}: UseMouseDragDetectorOpts): UseMouseDragDetector {
  // We need both state and ref for this.
  //  State lets us trigger a rerender / useEffect.
  //  Ref lets us check for cancellation when handling document events.
  //  We seem to get a few rogue onMouseMove events after we try to stop tracking.
  const [isTracking, setTracking] = React.useState(false);
  const mouseDownRef = React.useRef<Point | null>(null);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (!e.preventDefault) {
      return;
    }

    setTracking(true);
    mouseDownRef.current = { x: e.pageX, y: e.pageY };
  }, []);

  const onMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!mouseDownRef.current) {
        return;
      }

      const d = mouseDownRef.current;
      if (
        Math.abs(d.x - e.pageX) >= dragThreshold ||
        Math.abs(d.y - e.pageY) >= dragThreshold
      ) {
        if (onDragStart) {
          onDragStart(e, mouseDownRef.current);
        }
        setTracking(false);
        mouseDownRef.current = null;
      }
    },
    [dragThreshold, onDragStart]
  );

  const onMouseUp = React.useCallback(
    (e: MouseEvent) => {
      if (!mouseDownRef.current) {
        return;
      }

      if (onClick) {
        onClick(e);
      }

      setTracking(false);
      mouseDownRef.current = null;
    },
    [onClick]
  );

  React.useEffect(() => {
    if (!isTracking) {
      return;
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTracking, onMouseMove, onMouseUp]);

  return {
    startTracking: onMouseDown,
  };
}
