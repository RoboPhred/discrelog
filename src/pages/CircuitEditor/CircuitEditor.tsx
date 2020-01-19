import * as React from "react";

import { cls } from "@/utils";

import CircuitFieldView from "./components/CircuitFieldView";
import ElementTray from "./components/ElementTray";

import styles from "./CircuitEditor.module.css";

export interface CircuitEditorProps {
  className?: string;
}

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <div className={cls(className, styles.editor)}>
      <div className={styles["layout-columns"]}>
        <div className={styles["layout-rows"]}>
          <div className={cls(styles["toolwindow"], styles["toolwindow-row"])}>
            <ElementTray />
          </div>
          <div className={styles["fieldcontainer"]}>
            <CircuitFieldView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitEditor;
