import * as React from "react";

import styled from "styled-components";

import EditorLayout, { ToolWindow } from "@/components/EditorLayout";

import CircuitTray from "./ToolWindows/CircuitTray";
import TimingControls from "./ToolWindows/TimingControls";
import NodeInfo from "./ToolWindows/NodeInfo";
import PendingTransitions from "./ToolWindows/PendingTransitions";
import CircuitField from "./ContentViews/CircuitField";

const FillParentEditorLayout = styled(EditorLayout)`
  width: 100%;
  height: 100%;
`;

const FillParentCircuitField = styled(CircuitField)`
  width: 100%;
  height: 100%;
`;

export default class CircuitEditor extends React.Component {
  render() {
    return (
      <FillParentEditorLayout
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
        <FillParentCircuitField />
      </FillParentEditorLayout>
    );
  }
}
