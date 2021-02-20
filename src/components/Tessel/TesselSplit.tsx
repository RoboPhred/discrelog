import { cls } from "@/utils";
import * as React from "react";
import throttle from "lodash/throttle";

import { useRefValue } from "@/hooks/useRefValue";

import { TesselDirection } from "./types";

import styles from "./Tessel.module.css";

export interface TesselSplitProps {
  direction: TesselDirection;
  onChangePercentage(percent: number): void;
}

const ZeroRect: DOMRect = Object.freeze({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  toJSON: () => ({}),
});

const TesselSplit: React.FC<TesselSplitProps> = ({
  direction,
  onChangePercentage,
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const pointerCaptureRef = React.useRef<number | null>(null);

  // Ref these up so we can continue using the same throttle across rerenders.
  const directionRef = useRefValue(direction);
  const onChangePercentageRef = useRefValue(onChangePercentage);

  const onHandlePointerMove = React.useMemo(
    () =>
      throttle(
        (e: React.PointerEvent<HTMLDivElement>) => {
          if (pointerCaptureRef.current == null || ref.current == null) {
            return;
          }

          const parentRect =
            ref.current.parentElement?.getBoundingClientRect() ?? ZeroRect;

          let percentage = 0;
          if (directionRef.current === "row") {
            percentage = (e.pageX - parentRect.left) / parentRect.width;
          } else {
            percentage = (e.pageY - parentRect.top) / parentRect.height;
          }

          const onChangePercentage = onChangePercentageRef.current!;
          if (isNaN(percentage)) {
            onChangePercentage(0);
          } else if (percentage > 1) {
            onChangePercentage(100);
          } else {
            onChangePercentage(percentage * 100);
          }
        },
        1000 / 60,
        { leading: true }
      ),
    [directionRef, onChangePercentageRef]
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.persist();
      onHandlePointerMove(e);
    },
    [onHandlePointerMove]
  );

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.defaultPrevented || !ref.current) {
        return;
      }

      if (pointerCaptureRef.current) {
        return;
      }

      e.preventDefault();

      // We use pointer capture over the useMouseTracking
      // hook because pointer capture will capture our mouse icon.
      ref.current.setPointerCapture(e.pointerId);
      pointerCaptureRef.current = e.pointerId;
    },
    []
  );

  const onPointerUp = React.useCallback(() => {
    if (ref.current && pointerCaptureRef.current) {
      ref.current.releasePointerCapture(pointerCaptureRef.current);
      pointerCaptureRef.current = null;
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cls(
        "tessel-split",
        styles["tessel-split"],
        styles[
          direction === "row" ? "tessel-split--row" : "tessel-split--column"
        ]
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
};

export default TesselSplit;
