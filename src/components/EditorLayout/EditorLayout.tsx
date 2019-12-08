import * as React from "react";

import LayoutContainer from "./components/LayoutContainer";
import SidebarPanel from "./components/SidebarPanel";
import ContentPanel from "./components/ContentPanel";

import ResizeHandle from "./components/ResizeHandle";

export interface EditorPanelProps {
  className?: string;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  defaultLeftSidebarWidth?: number;
  defaultRightSidebarWidth?: number;
}

const EditorLayout: React.FC<EditorPanelProps> = ({
  className,
  defaultLeftSidebarWidth,
  defaultRightSidebarWidth,
  leftSidebar,
  rightSidebar,
  children
}) => {
  const [leftSidebarSize, setLeftSidebarSize] = React.useState(
    defaultLeftSidebarWidth || 100
  );
  const [rightSidebarSize, setRightSidebarSize] = React.useState(
    defaultRightSidebarWidth || 100
  );

  const onLeftSidebarResize = React.useCallback(
    (delta: number) => {
      setLeftSidebarSize(leftSidebarSize + delta);
    },
    [leftSidebarSize]
  );

  const onRightSidebarResize = React.useCallback(
    (delta: number) => {
      setRightSidebarSize(rightSidebarSize - delta);
    },
    [rightSidebarSize]
  );

  return (
    <LayoutContainer className={className}>
      {leftSidebar && (
        <React.Fragment>
          <SidebarPanel width={leftSidebarSize}>{leftSidebar}</SidebarPanel>
          <ResizeHandle onResize={onLeftSidebarResize} />
        </React.Fragment>
      )}
      <ContentPanel>{children}</ContentPanel>
      {rightSidebar && (
        <React.Fragment>
          <ResizeHandle onResize={onRightSidebarResize} />
          <SidebarPanel width={rightSidebarSize}>{rightSidebar}</SidebarPanel>
        </React.Fragment>
      )}
    </LayoutContainer>
  );
};

export default EditorLayout;
