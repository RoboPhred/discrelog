import * as React from "react";

import { cls, fpSetByArray } from "@/utils";

import { TesselValue, TesselWindowRenderer } from "./types";

import TesselFrame from "./TesselFrame";
import TesselDropCapture from "./TesselDropCapture";

import styles from "./Tessel.module.css";
import { useDrop } from "react-dnd";
import {
  isTesselWindowDragObject,
  TESSEL_WINDOW_DRAG_OBJECT,
} from "./drag-items/tessel-window";

export interface TesselProps {
  className?: string;
  rootItem: TesselValue;
  renderWindow: TesselWindowRenderer;
  onLayoutChange(rootItem: TesselValue): void;
}

const Tessel: React.FC<TesselProps> = ({
  className,
  rootItem,
  renderWindow,
  onLayoutChange,
}) => {
  const [{ draggingPath }, dropRef] = useDrop({
    accept: TESSEL_WINDOW_DRAG_OBJECT,
    collect: (monitor) => {
      const item = monitor.getItem();
      const isOver = monitor.isOver({ shallow: false });
      if (isOver && isTesselWindowDragObject(item)) {
        return { draggingPath: item.payload.path };
      }

      return {};
    },
  });

  // const transientValue = React.useMemo(() => {
  //   if (draggingPath == null) {
  //     return rootItem;
  //   }
  //   if (typeof rootItem === "string") {
  //     // Dragging our only item?
  //     return null;
  //   }
  //   return fpSetByArray(rootItem, draggingPath, null);
  // }, [rootItem, draggingPath]);

  return (
    <div ref={dropRef} className={cls("tessel", styles["tessel"], className)}>
      <TesselDropCapture>
        <div className={styles["tessel-content"]}>
          {rootItem && (
            <TesselFrame
              value={rootItem}
              renderWindow={renderWindow}
              onLayoutChange={onLayoutChange}
            />
          )}
        </div>
      </TesselDropCapture>
    </div>
  );
};

export default Tessel;
