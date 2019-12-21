import * as React from "react";

import { cls } from "@/utils";

import ResizeHandle from "../ResizeHandle";

import styles from "./EditorLayout.module.css";

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
    <div className={cls(className, styles["editor-root"])}>
      {leftSidebar && (
        <>
          <div
            className={styles["editor-sidebar-panel"]}
            style={{ width: leftSidebarSize }}
          >
            {leftSidebar}
          </div>
          <ResizeHandle onResize={onLeftSidebarResize} />
        </>
      )}
      <div className={styles["editor-content-panel"]}>{children}</div>
      {rightSidebar && (
        <>
          <ResizeHandle onResize={onRightSidebarResize} />
          <div
            className={styles["editor-sidebar-panel"]}
            style={{ width: rightSidebarSize }}
          >
            {rightSidebar}
          </div>
        </>
      )}
    </div>
  );
};

export default EditorLayout;
