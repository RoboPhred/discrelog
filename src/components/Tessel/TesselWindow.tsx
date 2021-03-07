import * as React from "react";

import { useDrag } from "react-dnd";

import { cls } from "@/utils";

import { tesselWindowDragObject } from "./drag-items/tessel-window";

import { useTesselPath } from "./TesselContext";
import TesselDropCapture from "./TesselDropCapture";

import styles from "./Tessel.module.css";

export interface TesselWindowProps {
  className?: string;
  title: string;
}
const TesselWindow: React.FC<TesselWindowProps> = ({
  title,
  className,
  children,
}) => {
  const path = useTesselPath();
  const [, dragSourceRef] = useDrag({
    item: tesselWindowDragObject(path),
  });

  return (
    <TesselDropCapture className={styles["tessel-window"]}>
      <div ref={dragSourceRef} className={styles["tessel-window-titlebar"]}>
        {title}
      </div>
      <div className={cls(styles["tessel-window-content"], className)}>
        {children}
      </div>
    </TesselDropCapture>
  );
};

export default TesselWindow;
