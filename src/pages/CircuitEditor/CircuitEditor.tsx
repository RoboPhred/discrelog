import * as React from "react";
import { createUseStyles } from "react-jss";

import EditorLayout, { ToolWindow } from "@/components/EditorLayout";

import CircuitTray from "./ToolWindows/CircuitTray";
import TimingControls from "./ToolWindows/TimingControls";
import NodeInfo from "./ToolWindows/NodeInfo";
import PendingTransitions from "./ToolWindows/PendingTransitions";
import CircuitField from "./ContentViews/CircuitField";

const useStyles = createUseStyles({
  fillParent: {
    width: "100%",
    height: "100%"
  }
});

const CircuitEditor: React.FC = () => {
  const styles = useStyles();
  return (
    <EditorLayout
      className={styles.fillParent}
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
      <CircuitField className={styles.fillParent} />
    </EditorLayout>
  );
}

export default CircuitEditor;