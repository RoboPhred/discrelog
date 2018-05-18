
import * as React from "react";

import EditorLayout, { ToolWindow } from "@/components/EditorLayout";

import CircuitTray from "./components/CircuitTray";
import CircuitField from "./components/CircuitField";

export default class CircuitEditor extends React.Component {
    render() {
        return (
            <EditorLayout
                leftSidebar={(
                    <ToolWindow>
                        <CircuitTray/>
                    </ToolWindow>
                )}
            >
                <CircuitField/>
            </EditorLayout>
        );
    }
}
