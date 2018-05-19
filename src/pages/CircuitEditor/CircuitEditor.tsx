import * as React from "react";

import styled from "styled-components";

import EditorLayout, { ToolWindow } from "@/components/EditorLayout";

import CircuitTray from "./components/CircuitTray";
import TimingControls from "./components/TimingControls";
import CircuitOutputs from "./components/CircuitOutputs";
import PendingTransitions from "./components/PendingTransitions";
import CircuitField from "./components/CircuitField";

const FillParentEditorLayout = styled(EditorLayout) `
  width: 100%;
  height: 100%;
`;

const FillParentCircuitField = styled(CircuitField) `
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
        rightSidebar={
          <React.Fragment>
            <ToolWindow>
              <TimingControls />
            </ToolWindow>
            <ToolWindow>
              <CircuitOutputs />
            </ToolWindow>
            <ToolWindow>
              <PendingTransitions />
            </ToolWindow>
          </React.Fragment>
        }
      >
        <FillParentCircuitField />
      </FillParentEditorLayout>
    );
  }
}
