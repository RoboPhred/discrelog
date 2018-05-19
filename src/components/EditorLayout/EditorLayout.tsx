import * as React from "react";

import LayoutContainer from "./components/LayoutContainer";
import SidebarPanel from "./components/SidebarPanel";
import ContentPanel from "./components/ContentPanel";

export interface EditorPanelProps {
  className?: string;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
}
type Props = EditorPanelProps;
class EditorLayout extends React.Component<Props> {
  render() {
    const { leftSidebar, rightSidebar, children } = this.props;
    return (
      <LayoutContainer className={this.props.className}>
        {leftSidebar && <SidebarPanel>{leftSidebar}</SidebarPanel>}
        <ContentPanel>{children}</ContentPanel>
        {rightSidebar && <SidebarPanel>{rightSidebar}</SidebarPanel>}
      </LayoutContainer>
    );
  }
}
export default EditorLayout;
