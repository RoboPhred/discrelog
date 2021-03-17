import * as React from "react";

import { cls } from "@/utils";

import styles from "./TitleBar.module.css";

export interface TitleBarProps {
  className?: string;
  title?: string;
}
const TitleBar: React.FC<TitleBarProps> = ({ className, title, children }) => {
  return (
    <div className={cls(styles.titlebar, className)}>
      <span className={styles["titlebar-heading"]}>Discrelog</span>
      <div className={styles["titlebar-divider"]} />
      {title && <div className={styles["titlebar-title"]}>{title}</div>}
      {children}
    </div>
  );
};

export default TitleBar;
