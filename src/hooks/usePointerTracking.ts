import * as React from "react";
import { Point, ZeroPoint, pointSubtract } from "@/geometry";
import { useRefValue } from "./useRefValue";

export interface UsePointerTracking {
  startTracking(e: React.PointerEvent | PointerEvent): void;
  cancelTracking(): void;
}

export interface PointerTrackingOptions {
  dragThreshold?: number;
  onClick?(e: PointerEvent): void;
  onDragStart?(e: PointerEvent): void;
  onDragMove?(offset: Point, e: PointerEvent): void;
  onDragEnd?(offset: Point, e: PointerEvent): void;
}

export default function usePointerTracking(
  opts: PointerTrackingOptions
): UsePointerTracking {
  const {
    dragThreshold = 5,
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
  } = opts;

  const refDragThreshold = useRefValue(dragThreshold);
  const refOnClick = useRefValue(onClick);
  const refOnDragStart = useRefValue(onDragStart);
  const refOnDragMove = useRefValue(onDragMove);
  const refOnDragEnd = useRefValue(onDragEnd);

  // We need both state and ref for this.
  //  State lets us trigger a rerender / useEffect.
  //  Ref lets us check for cancellation when handling document events.
  //  We seem to get a few rogue onMouseMove events after we try to stop tracking.
  const trackingPointerRef = React.useRef<number | null>(null);
  const trackingElementRef = React.useRef<Element | null>(null);

  const isDraggingRef = React.useRef(false);
  const mouseDownRef = React.useRef<Point>(ZeroPoint);

  const onPointerMove = React.useCallback((e: PointerEvent) => {
    if (e.pointerId !== trackingPointerRef.current) {
      return;
    }

    if (isDraggingRef.current) {
      if (refOnDragMove.current) {
        const offset = pointSubtract(
          { x: e.pageX, y: e.pageY },
          mouseDownRef.current
        );
        refOnDragMove.current(offset, e);
      }
      e.preventDefault();
      e.stopPropagation();
    } else {
      const d = mouseDownRef.current;
      const thresh = refDragThreshold.current!;
      if (
        Math.abs(d.x - e.pageX) >= thresh ||
        Math.abs(d.y - e.pageY) >= thresh
      ) {
        isDraggingRef.current = true;
        if (refOnDragStart.current) {
          refOnDragStart.current(e);
        }
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  const onPointerUp = React.useCallback((e: PointerEvent) => {
    if (e.pointerId !== trackingPointerRef.current) {
      return;
    }

    if (isDraggingRef.current) {
      if (refOnDragEnd.current) {
        const offset = pointSubtract(
          { x: e.pageX, y: e.pageY },
          mouseDownRef.current
        );
        refOnDragEnd.current(offset, e);
      }
    } else {
      if (refOnClick.current) {
        refOnClick.current(e);
      }
    }

    cancelTracking();
  }, []);

  const cancelTracking = React.useCallback(() => {
    console.log("cancel tracking");
    const element = trackingElementRef.current!;
    element.releasePointerCapture(trackingPointerRef.current!);
    element.removeEventListener("pointermove", onPointerMove as any);
    element.removeEventListener("pointerup", onPointerUp as any);
    element.removeEventListener("pointercancel", cancelTracking);
    trackingPointerRef.current = null;
    isDraggingRef.current = false;
    mouseDownRef.current = ZeroPoint;
  }, []);

  const startTracking = React.useCallback((e: React.PointerEvent<Element>) => {
    if (trackingPointerRef.current !== null) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;

    console.log("start tracking", target);

    trackingPointerRef.current = e.pointerId;
    target.setPointerCapture(e.pointerId);
    target.addEventListener("pointermove", onPointerMove as any);
    target.addEventListener("pointerup", onPointerUp as any);
    target.addEventListener("pointercancel", cancelTracking);
    trackingElementRef.current = target;
    mouseDownRef.current = { x: e.pageX, y: e.pageY };
  }, []);

  // React.useEffect(() => {
  //   if (!isTracking) {
  //     return;
  //   }

  //   document.addEventListener("pointermove", onPointerMove);
  //   document.addEventListener("pointerup", onPointerUp);
  //   document.addEventListener("pointercancel", cancelTracking);

  //   return () => {
  //     document.removeEventListener("pointermove", onPointerMove);
  //     document.removeEventListener("pointerup", onPointerUp);
  //     document.removeEventListener("pointercancel", cancelTracking);
  //   };
  // }, [cancelTracking, isTracking, onPointerMove, onPointerUp]);

  return {
    startTracking,
    cancelTracking,
  };
}
