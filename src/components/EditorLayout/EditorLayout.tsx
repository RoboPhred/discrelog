import * as React from "react";

import { createUseStyles } from "react-jss";

import { cls } from "@/utils";

import ResizeHandle from "./components/ResizeHandle";

export interface EditorPanelProps {
  className?: string;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  defaultLeftSidebarWidth?: number;
  defaultRightSidebarWidth?: number;
}

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch"
  },
  contentPanel: {
    flex: "1 1 auto",
    background: "darkgray",
    minWidth: "10px"
  },
  sidebarPanel: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: "lightgrey",
    border: "1 solid darkgray",
  }
})

const EditorLayout: React.FC<EditorPanelProps> = ({
  className,
  defaultLeftSidebarWidth,
  defaultRightSidebarWidth,
  leftSidebar,
  rightSidebar,
  children
}) => {
  const styles = useStyles();

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
    <div className={cls(className, styles.root)}>
      {leftSidebar && (
        <>
          <div className={styles.sidebarPanel} style={{ width: leftSidebarSize }}>{leftSidebar}</div>
          <ResizeHandle onResize={onLeftSidebarResize} />
        </>
      )}
      <div className={styles.contentPanel}>{children}</div>
      {rightSidebar && (
        <>
          <ResizeHandle onResize={onRightSidebarResize} />
          <div className={styles.sidebarPanel} style={{ width: rightSidebarSize }}>{rightSidebar}</div>
        </>
      )}
    </div>
  );
};

export default EditorLayout;
