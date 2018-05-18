import * as React from "react";

import FlexHorizontal from "./components/FlexHorizontal";
import FlexVertical from "./components/FlexVertical";

export interface EditorPanelProps {
    leftSidebar?: React.ReactNode;
}
type Props = EditorPanelProps;
class EditorLayout extends React.Component<Props> {
    render() {
        const {
            leftSidebar,
            children
        } = this.props;
        return (
            <FlexHorizontal>
                {leftSidebar && <FlexVertical>{leftSidebar}</FlexVertical>}
                {children}
            </FlexHorizontal>
        );
    }
}
export default EditorLayout;
