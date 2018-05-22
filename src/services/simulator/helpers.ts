import binarySearch from "binary-search";

import { IDMap } from "@/types";

import { Node, NodePin, NodesById, PendingTransition, TransitionWindow } from "./types";
import { NodeTypes, EvolutionResult } from "./node-types";
import { SimulatorState } from "./state";

export function isWired(
  nodes: NodesById,
  output: NodePin,
  input: NodePin
): boolean {
  const inputNode = nodes[input.nodeId];

  if (!inputNode) {
    return false;
  }

  const conn = inputNode.inputConnectionsByPin[input.pin];
  if (!conn) {
    return false;
  }

  return conn.nodeId === output.nodeId && conn.pin === output.pin;
}


/**
 * Determines the next transitions for a given node based on its current
 * inputs.
 */
export function evolveNode(state: SimulatorState, node: string | Node): void {
  if (typeof node === "string") {
    node = state.nodesById[node];
  }

  const { tick, nodeStatesByNodeId, nodeOutputValuesByNodeId, transitionWindows } = state;

  // Evolve with the new inputs.
  const type = NodeTypes[node.type];
  if (type && type.evolve) {
    const inputs: IDMap<boolean> = {};
    for (const inputPin of Object.keys(node.inputConnectionsByPin)) {
      const inputConn = node.inputConnectionsByPin[inputPin];
      if (!inputConn) {
        inputs[inputPin] = false;
        continue;
      }
      const { nodeId: sourceNodeId, pin: sourcePin } = inputConn;

      inputs[inputPin] = nodeOutputValuesByNodeId[sourceNodeId][sourcePin];
    }

    // TODO: Provide frozen state.  The state passed to this is currently
    //  the immer mutable record.
    const result = type.evolve(nodeStatesByNodeId[node.id] || {}, inputs, tick);
    applyNodeEvolution(node, tick, result, nodeStatesByNodeId, transitionWindows);
  }
}

export function applyNodeEvolution(
  node: Node,
  tick: number,
  evolution: EvolutionResult,
  nodeStates: { [key: string]: any },
  transitionWindows: TransitionWindow[]
) {
  if (evolution.state) {
    nodeStates[node.id] = evolution.state;
  }

  if (evolution.transitions) {
    for (const transition of evolution.transitions) {
      // Register the transition.
      const transitionTick = tick + transition.tickOffset;
      const transitionWindow = getWindow(transitionWindows, transitionTick);
      transitionWindow.transitions.push({
        nodeId: node.id,
        outputPinId: transition.outputId,
        value: transition.value
      });
    }
  }
}

function getWindow(
  windows: TransitionWindow[],
  tick: number
): TransitionWindow {
  const index = binarySearch(windows, tick, (a, b) => b - a.tick);
  if (index >= 0) {
    return windows[index];
  }

  const insertAt = -index - 1;
  const result: TransitionWindow = {
    tick,
    transitions: []
  };
  windows.splice(insertAt, 0, result);
  return result;
}