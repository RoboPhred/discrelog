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
      <div className={styles["editor-fieldcontainer"]}>
        <CircuitFieldView className={cls(styles["editor-field"])} />
      </div>
      <div className={styles["editor-toolwindow-horizontal"]}>
        <ElementTray />
      </div>
    </div>
  );
};

export default CircuitEditor;
