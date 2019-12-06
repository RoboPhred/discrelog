import { IDMap } from "@/types";

import { SimulatorState } from "../state";

import { NodeTypes } from "../node-types";

import { addTransition, removeTransitionByPin } from "./transition-utils";

export function collectNodeTransitionsMutator(
  state: SimulatorState,
  nodeId: string
) {
  const { tick, nodeStatesByNodeId, nodeOutputValuesByNodeId } = state;

  const node = state.nodesById[nodeId];
  if (!node) {
    return;
  }

  // Evolve with the new inputs.
  const type = NodeTypes[node.type];
  if (!type || !type.evolve) {
    return;
  }

  // Build the current input state from the connected pins.
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
  const result = type.evolve(nodeStatesByNodeId[node.id], inputs, tick);

  if (result.state) {
    nodeStatesByNodeId[node.id] = result.state;
  }

  if (result.transitions) {
    const nodeOutputs = nodeOutputValuesByNodeId[node.id] || {};
    for (const outputId of Object.keys(result.transitions)) {
      const { tickOffset, value } = result.transitions[outputId];

      // Sanity check that we are not producing transitions for the past or current tick.
      const transitionTick = tick + (tickOffset > 0 ? tickOffset : 1);

      removeTransitionByPin(state, { nodeId: node.id, pin: outputId });

      if (nodeOutputs[outputId] !== value) {
        addTransition(state, node.id, outputId, transitionTick, value);
      }
    }
  }
}
