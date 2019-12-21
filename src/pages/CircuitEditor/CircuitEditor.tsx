import * as React from "react";

import sizing from "@/styles/sizing.module.css";

import EditorLayout from "@/components/EditorLayout";
import ToolWindow from "@/components/ToolWindow";

import CircuitTray from "./ToolWindows/CircuitTray";
import TimingControls from "./ToolWindows/TimingControls";
import NodeInfo from "./ToolWindows/NodeInfo";
import PendingTransitions from "./ToolWindows/PendingTransitions";
import CircuitFieldView from "./ContentViews/CircuitFieldView";

export interface CircuitEditorProps {
  className?: string;
}

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <EditorLayout
      className={className}
      leftSidebar={
        <ToolWindow>
          <CircuitTray />
        </ToolWindow>
      }
      defaultLeftSidebarWidth={100}
      rightSidebar={
        <React.Fragment>
          <ToolWindow>
            <TimingControls />
          </ToolWindow>
          <ToolWindow>
            <NodeInfo />
          </ToolWindow>
          <ToolWindow>
            <PendingTransitions />
          </ToolWindow>
        </React.Fragment>
      }
      defaultRightSidebarWidth={200}
    >
      <CircuitFieldView className={sizing["fill-parent"]} />
    </EditorLayout>
  );
};

export default CircuitEditor;
