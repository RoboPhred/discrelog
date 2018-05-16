
import { EdgeConnection } from "./types";
import { SimulatorState } from "./state";

export function isWired(state: SimulatorState, output: EdgeConnection, input: EdgeConnection): boolean {
    const outputNode = state.nodes[output.nodeId];
    const inputNode = state.nodes[input.nodeId];
    if(!outputNode || !inputNode) {
        return false;
    }

    const edgeId = outputNode.outputEdgeIds[output.port];
    if (!edgeId) {
        return false;
    }

    const edge = state.edges[edgeId];
    if (!edge) {
        return false;
    }

    return edge.targets.some(c => c.nodeId === input.nodeId && c.port === input.port);
}
