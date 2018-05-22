import binarySearch from "binary-search";

import { IDMap } from "@/types";

import { SimulatorState } from "../state";

import { Node, TransitionWindow } from "../types";
import { NodeTypes, EvolutionResult } from "../node-types";

export function collectTransitionsMutator(state: SimulatorState) {
  // TODO: This can be made more efficient by tracking which nodes
  //  need to be checked for updates.
  const dirtyInputs = [...state.dirtyInputNodeIds];
  state.dirtyInputNodeIds = [];
  for (const nodeId of dirtyInputs) {
    const node = state.nodesById[nodeId];
    collectNodeTransitionsMutator(state, node);
  }
}

function collectNodeTransitionsMutator(state: SimulatorState, node: Node) {
  console.log("collecting transitions for", node.id);

  const {
    tick,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    transitionWindows
  } = state;

  // Evolve with the new inputs.
  const type = NodeTypes[node.type];
  if (type == null || type.evolve == null) {
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
    for (const transition of result.transitions) {
      const { outputId, value } = transition;

      // Sanity check that we are not producing transitions for the past or current tick.
      const tickOffset = transition.tickOffset > 0 ? transition.tickOffset : 1;

      const transitionTick = tick + tickOffset;

      // Find the transition tick window this transition will occur at.
      const transitionsByNodeId = getWindow(transitionWindows, transitionTick)
        .transitionsByNodeId;

      // Get the transitions for this node at the transition tick.
      let nodeTransitions = transitionsByNodeId[node.id];
      if (!nodeTransitions) {
        nodeTransitions = {};
        transitionsByNodeId[node.id] = nodeTransitions;
      }

      console.log(`> tick ${transitionTick} pin ${outputId} = ${value}`);
      nodeTransitions[outputId] = value;
    }
  }
}

function getWindow(
  windows: TransitionWindow[],
  tick: number
): TransitionWindow {
  const index = binarySearch(windows, tick, (a, b) => a.tick - b);
  if (index >= 0) {
    return windows[index];
  }

  const insertAt = -index - 1;
  const result: TransitionWindow = {
    tick,
    transitionsByNodeId: {}
  };
  windows.splice(insertAt, 0, result);
  return result;
}
