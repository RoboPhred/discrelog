import * as React from "react";

import { useDrag } from "react-dnd";

import { cls } from "@/utils";

import { tesselWindowDragObject } from "./drag-items/tessel-window";

import { useTesselInteraction, useTesselPath } from "./TesselContext";
import TesselDropCapture from "./TesselDropCapture";

import styles from "./Tessel.module.css";
import CloseIcon from "../Icons/Close";

export interface TesselWindowProps {
  className?: string;
  id?: string;
  title: string;
}
const TesselWindow: React.FC<TesselWindowProps> = ({
  className,
  id,
  title,
  children,
}) => {
  const path = useTesselPath();

  const { closeWindow } = useTesselInteraction();
  const onCloseWindow = React.useCallback(() => {
    closeWindow(path);
  }, [closeWindow, path]);

  const [, dragSourceRef] = useDrag({
    item: tesselWindowDragObject(path),
  });

  return (
    <TesselDropCapture id={id} className={styles["tessel-window"]}>
      <div ref={dragSourceRef} className={styles["tessel-window-titlebar"]}>
        <div className={styles["tessel-window-title"]}>{title}</div>
        <div className={styles["tessel-window-controls"]}>
          <CloseIcon
            className={styles["tessel-window-controls-close"]}
            onClick={onCloseWindow}
          />
        </div>
      </div>
      <div className={cls(styles["tessel-window-content"], className)}>
        {children}
      </div>
    </TesselDropCapture>
  );
};

export default TesselWindow;
