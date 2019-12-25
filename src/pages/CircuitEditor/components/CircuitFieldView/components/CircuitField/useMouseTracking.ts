import * as React from "react";

import { Point } from "@/types";
import { keyboardIsMac } from "@/runtime-env";

import { getFieldCoord } from "./utils";
import { ModifierKeys } from "./types";

const DRAG_THRESHOLD = 5;

export interface UseMouseTracking {
  onMouseDown(e: React.MouseEvent): void;
  onMouseMove(e: React.MouseEvent): void;
  onMouseUp(e: React.MouseEvent): void;
  cancelDrag(): void;
}

export default function useMouseTracking(
  svgRef: React.RefObject<SVGSVGElement>,
  onClick: (p: Point, modifiers: ModifierKeys) => void,
  onDragStart: (p: Point, modifiers: ModifierKeys) => void,
  onDragContinue: (p: Point) => void,
  onDragEnd: (p: Point, modifiers: ModifierKeys) => void
) {
  const isDraggingRef = React.useRef(false);
  const startMousePosRef = React.useRef<Point | null>(null);

  const cancelDrag = React.useCallback(() => {
    isDraggingRef.current = false;
    startMousePosRef.current = null;
  }, []);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (!svgRef.current) {
      return;
    }

    svgRef.current.focus();

    const p = getFieldCoord(svgRef.current, {
      x: e.clientX,
      y: e.clientY
    });

    startMousePosRef.current = p;

    // Prevent default to stop the browser running mouse logic, like double click text selection.
    e.preventDefault();
  }, []);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      if (!startMousePosRef.current) {
        return;
      }

      if (!svgRef.current) {
        return;
      }

      const { x: sx, y: sy } = startMousePosRef.current;

      const { ctrlKey, altKey, shiftKey, metaKey } = e;
      const modifiers = {
        ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
        altKey: altKey,
        shiftKey
      };

      const { x, y } = getFieldCoord(svgRef.current, {
        x: e.clientX,
        y: e.clientY
      });

      if (!isDraggingRef.current) {
        if (
          Math.abs(x - sx) < DRAG_THRESHOLD &&
          Math.abs(y - sy) < DRAG_THRESHOLD
        ) {
          return;
        }

        isDraggingRef.current = true;
        onDragStart({ x, y }, modifiers);
      } else {
        onDragContinue({ x, y });
      }
    },
    [onDragStart, onDragContinue]
  );

  const onMouseUp = React.useCallback((e: React.MouseEvent) => {
    if (e.defaultPrevented) {
      cancelDrag();
      return;
    }

    if (!svgRef.current) {
      return;
    }

    const { ctrlKey, altKey, metaKey, shiftKey } = e;
    const { x, y } = getFieldCoord(svgRef.current, {
      x: e.clientX,
      y: e.clientY
    });

    const modifiers = {
      ctrlMetaKey: keyboardIsMac ? metaKey : ctrlKey,
      altKey: altKey,
      shiftKey
    };

    if (isDraggingRef.current) {
      onDragEnd({ x, y }, modifiers);
    } else {
      onClick({ x, y }, modifiers);
    }

    e.preventDefault();

    cancelDrag();
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    cancelDrag
  };
}
