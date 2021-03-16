import { cls } from "@/utils";
import * as React from "react";
import throttle from "lodash/throttle";

import { useRefValue } from "@/hooks/useRefValue";

import { TesselDirection } from "./types";

import styles from "./Tessel.module.css";

export interface TesselSplitProps {
  direction: TesselDirection;
  onChangePercentage(percent: number, position: number): void;
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
          let position = 0;
          if (directionRef.current === "row") {
            position = e.pageX - parentRect.left;
            percentage = position / parentRect.width;
            if (isNaN(percentage)) {
              percentage = 0;
              position = parentRect.left;
            } else if (percentage > 1) {
              percentage = 1;
              position = parentRect.right;
            }
          } else {
            position = e.pageY - parentRect.top;
            percentage = position / parentRect.height;
            if (isNaN(percentage)) {
              percentage = 0;
              position = parentRect.top;
            } else if (percentage > 1) {
              percentage = 1;
              position = parentRect.bottom;
            }
          }

          onChangePercentageRef.current!(percentage * 100, position);
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
