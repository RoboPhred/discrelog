import { arrayEquals } from "@/arrays";
import { useComponentBounds } from "@/hooks/useComponentBounds";
import { cls } from "@/utils";
import * as React from "react";
import { useDrop } from "react-dnd";

import {
  isTesselWindowDragObject,
  TESSEL_WINDOW_DRAG_OBJECT,
} from "./drag-items/tessel-window";

import styles from "./Tessel.module.css";
import { useTesselPath } from "./TesselContext";

export interface TesselDropCaptureProps {
  className?: string;
  children?: React.ReactNode;
}
const TesselDropCapture = React.forwardRef<
  HTMLDivElement,
  TesselDropCaptureProps
>(({ className, children }, forwardRef) => {
  const tesselPath = useTesselPath();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { top, left, right, bottom } = useComponentBounds(ref);
  const [dropPos, setDropPos] = React.useState<
    "left" | "top" | "right" | "bottom" | null
  >(null);

  const [{ draggingSelf }, dropRef] = useDrop(
    {
      accept: TESSEL_WINDOW_DRAG_OBJECT,
      collect: (monitor) => {
        // This is here as hover is not called on hover exit.
        // We need something to capture the exit event.
        if (!monitor.isOver({ shallow: true })) {
          setDropPos(null);
        }

        const item = monitor.getItem();
        if (!item || !isTesselWindowDragObject(item)) {
          return {};
        }

        return {
          draggingSelf: arrayEquals(item.payload.path, tesselPath),
        };
      },
      hover: (item, monitor) => {
        if (!monitor.isOver({ shallow: true })) {
          setDropPos(null);
          return;
        }

        const pos = monitor.getClientOffset();
        if (item == null || pos == null || !isTesselWindowDragObject(item)) {
          setDropPos(null);
          return;
        }

        if (pos.x < left || pos.x > right) {
          setDropPos(null);
          return;
        }

        if (pos.y < top || pos.y > bottom) {
          setDropPos(null);
          return;
        }

        const relX = pos.x - left;
        const xPercent = relX / (right - left);
        if (xPercent <= 0.3) {
          setDropPos("left");
          return;
        }
        if (xPercent >= 0.6) {
          setDropPos("right");
          return;
        }

        const relY = pos.y - top;
        const yPercent = relY / (bottom - top);
        if (yPercent <= 0.3) {
          setDropPos("top");
          return;
        }
        if (yPercent >= 0.6) {
          setDropPos("bottom");
          return;
        }

        setDropPos(null);
      },
    },
    [top, left, right, bottom]
  );

  let dropMarkerClassname = styles["tessel-drop-marker"] + " ";
  if (dropPos != null && !draggingSelf) {
    switch (dropPos) {
      case "bottom":
        dropMarkerClassname += styles["drop-bottom"];
        break;
      case "top":
        dropMarkerClassname += styles["drop-top"];
        break;
      case "left":
        dropMarkerClassname += styles["drop-left"];
        break;
      case "right":
        dropMarkerClassname += styles["drop-right"];
        break;
    }
  }

  return (
    <div
      ref={(divRef) => {
        ref.current = divRef;
        dropRef(divRef);
        if (typeof forwardRef === "function") {
          forwardRef(divRef);
        } else if (forwardRef) {
          forwardRef.current = divRef;
        }
      }}
      className={cls(
        styles["tessel-drop-capture"],
        draggingSelf && styles["tessel-drop-capture--dragging"],
        className
      )}
    >
      {children}
      <div className={dropMarkerClassname} />
    </div>
  );
});

export default TesselDropCapture;
