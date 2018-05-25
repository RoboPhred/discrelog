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
type Props = EditorPanelProps;
interface State {
  leftSidebarSize: number;
  rightSidebarSize: number;
}
class EditorLayout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      leftSidebarSize: props.defaultLeftSidebarWidth || 100,
      rightSidebarSize: props.defaultRightSidebarWidth || 100
    };

    this._leftSidebarResize = this._leftSidebarResize.bind(this);
    this._rightSidebarResize = this._rightSidebarResize.bind(this);
  }

  render() {
    const { leftSidebar, rightSidebar, children } = this.props;
    const { leftSidebarSize, rightSidebarSize } = this.state;

    return (
      <LayoutContainer className={this.props.className}>
        {leftSidebar && (
          <React.Fragment>
            <SidebarPanel width={leftSidebarSize}>{leftSidebar}</SidebarPanel>
            <ResizeHandle onResize={this._leftSidebarResize} />
          </React.Fragment>
        )}
        <ContentPanel>{children}</ContentPanel>
        {rightSidebar && (
          <React.Fragment>
            <ResizeHandle onResize={this._rightSidebarResize} />
            <SidebarPanel width={rightSidebarSize}>{rightSidebar}</SidebarPanel>
          </React.Fragment>
        )}
      </LayoutContainer>
    );
  }

  private _leftSidebarResize(delta: number) {
    this.setState(s => ({
      leftSidebarSize: s.leftSidebarSize + delta
    }));
  }

  private _rightSidebarResize(delta: number) {
    this.setState(s => ({
      rightSidebarSize: s.rightSidebarSize - delta
    }));
  }
}
export default EditorLayout;
