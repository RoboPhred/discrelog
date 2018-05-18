import * as React from "react";

import LayoutContainer from "./components/LayoutContainer";
import SidebarPanel from "./components/SidebarPanel";
import ContentPanel from "./components/ContentPanel";

export interface EditorPanelProps {
  leftSidebar?: React.ReactNode;
}
type Props = EditorPanelProps;
class EditorLayout extends React.Component<Props> {
  render() {
    const { leftSidebar, children } = this.props;
    return (
      <LayoutContainer>
        {leftSidebar && <SidebarPanel>{leftSidebar}</SidebarPanel>}
        <ContentPanel>{children}</ContentPanel>
      </LayoutContainer>
    );
  }
}
export default EditorLayout;
