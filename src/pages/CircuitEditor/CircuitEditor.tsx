
import * as React from "react";

import CircuitTray from "./components/CircuitTray";
import CircuitField from "./components/CircuitField";

export default class CircuitEditor extends React.Component {
    render() {
        const style: React.CSSProperties = {
            display: "flex",
            flexDirection: "row"
        };
        return (
            <div style={style}>
                <CircuitTray/>
                <CircuitField/>
            </div>
        );
    }
}
