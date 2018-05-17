
import { PinConnection } from "./types";
import { SimulatorState } from "./state";

export function isWired(state: SimulatorState, output: PinConnection, input: PinConnection): boolean {
    const outputNode = state.nodes[output.nodeId];
    const inputNode = state.nodes[input.nodeId];
    
    if(!outputNode || !inputNode) {
        return false;
    }

    const conn = inputNode.inputConnectionsByPin[input.pin];
    if (!conn) {
        return false;
    }
    
    return conn.nodeId === output.nodeId && conn.pin === output.pin;
}
