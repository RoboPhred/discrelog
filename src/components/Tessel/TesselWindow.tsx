import * as React from "react";

import { cls } from "@/utils";

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
  return (
    <div className={styles["tessel-window"]}>
      <div className={styles["tessel-window-titlebar"]}>{title}</div>
      <div className={cls(styles["tessel-window-content"], className)}>
        {children}
      </div>
    </div>
  );
};

export default TesselWindow;
