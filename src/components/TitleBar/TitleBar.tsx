import * as React from "react";

import { cls } from "@/utils";

import styles from "./TitleBar.module.css";

export interface TitleBarProps {
  className?: string;
}
const TitleBar: React.FC<TitleBarProps> = ({ className, children }) => {
  return (
    <div className={cls(styles.titlebar, className)}>
      <span className={styles["titlebar-heading"]}>Discrelog</span>
      <div className={styles["titlebar-divider"]} />
      {children}
    </div>
  );
};

export default TitleBar;
