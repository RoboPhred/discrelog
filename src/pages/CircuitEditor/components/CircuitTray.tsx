import * as React from "react";

import { connect } from "react-redux";

import { addNode } from "@/services/simulator/actions";
import { NodeTypes, NodeType } from "@/services/simulator/nodes";

import { typedKeys } from "@/utils";

interface DispatchProps {
    addNode: typeof addNode;
}

const mapDispatchToProps = {
    addNode
};

type Props = DispatchProps;
class CircuitTray extends React.Component<Props> {
    render() {
        const {
            addNode
        } = this.props;
        
        const elements = typedKeys(NodeTypes).map(typeKey => {
            const type = NodeTypes[typeKey as NodeType];
            return (
                <div 
                    key={typeKey}
                    onClick={() => addNode(typeKey)}
                >
                    <svg
                        width={type.width + 1}
                        height={type.height + 1}
                    >
                        <path
                            transform="translate(.5,.5)"
                            d={type.shapePath}
                            stroke="black"
                            strokeWidth={1}
                            fill="white"
                        />
                </svg>
                </div>
            )
        });

        // TODO: styled component?
        const style: React.CSSProperties = {
            display: "flex",
            flexDirection: "column"
        };
        return (
            <div style={style}>
                {elements}
            </div>
        );
    }
}
export default connect(null, mapDispatchToProps)(CircuitTray);
