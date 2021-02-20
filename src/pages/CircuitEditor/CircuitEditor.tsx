import * as React from "react";

import { cls } from "@/utils";

import flex from "@/styles/flex.module.css";

import CircuitFieldWindow from "./windows/CircuitFieldWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import NodeTrayWindow from "./windows/NodeTrayWindow";

import styles from "./CircuitEditor.module.css";

export interface CircuitEditorProps {
  className?: string;
}

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <div className={cls("circuit-editor", flex["flex-row"], className)}>
      <NodeTrayWindow className={flex["flexitem-shrink"]} />
      <CircuitFieldWindow className={styles["circuiteditor-field"]} />
      <CircuitsTreeWindow className={flex["flexitem-shrink"]} />
    </div>
  );
};

export default CircuitEditor;
