import produce from "immer";

import binarySearch from "binary-search";

import { mapValues } from "lodash-es";

import { IDMap } from "@/types";

import { Node, PinConnection } from "./types";

import {
  SimulatorState,
  defaultSimulatorState,
  TransitionWindow
} from "./state";

import {
  Actions,
  ACTION_WIRE,
  ACTION_UNWIRE,
  ACTION_TOGGLEWIRE,
  ACTION_EVOLVE,
  ACTION_INTERACT,
  WireNodeAction,
  UnwireNodeAction,
  InteractNodeAction,
  EvolveSimAction,
  AddNodeAction,
  ACTION_NODE_ADD
} from "./actions";

import { PendingTransition } from "./types";

import { EvolutionResult, NodeTypes } from "./node-types";

import { isWired } from "./helpers";

const addNodeReducer = produce(
  (state: SimulatorState, action: AddNodeAction) => {
    const { nodeId: id, nodeType: type } = action.payload;

    const def = NodeTypes[type];
    if (!def) {
      return;
    }

    const { nodesById, nodeStatesByNodeId, nodeOutputValuesByNodeId } = state;

    nodesById[id] = {
      id,
      type,
      inputConnectionsByPin: mapValues(def.inputs, () => null),
      outputConnectionsByPin: mapValues(def.outputs, () => [])
    };

    nodeStatesByNodeId[id] = {};
    nodeOutputValuesByNodeId[id] = mapValues(def.outputs, () => false);

    // Give the node a chance to evolve.
    evolveNode(state, id);
  }
);

const wireNodeReducer = produce(
  (state: SimulatorState, action: WireNodeAction) => {
    const { sourceNodeId, sourcePin, targetNodeId, targetPin } = action.payload;

    const { tick, nodeStatesByNodeId, nodeOutputValuesByNodeId, transitionWindows } = state;

    const sourceNode = state.nodesById[sourceNodeId];
    const targetNode = state.nodesById[targetNodeId];

    if (!sourceNode || !targetNode) {
      return;
    }

    // Only one source per input.
    if (targetNode.inputConnectionsByPin[targetPin]) {
      return;
    }

    // Tell the target about the source.
    targetNode.inputConnectionsByPin[targetPin] = {
      nodeId: sourceNodeId,
      pin: sourcePin
    };

    // Tell the source about the target.
    sourceNode.outputConnectionsByPin[sourcePin].push({
      nodeId: targetNodeId,
      pin: targetPin
    });

    // Evolve with the new inputs.
    evolveNode(state, targetNode);
  }
);

const unwireNodeReducer = produce(
  (state: SimulatorState, action: UnwireNodeAction) => {
    const { sourceNodeId, sourcePin, targetNodeId, targetPin } = action.payload;

    const { tick, nodeStatesByNodeId, transitionWindows } = state;

    const sourceNode = state.nodesById[sourceNodeId];
    const targetNode = state.nodesById[targetNodeId];

    if (!sourceNode || !targetNode) {
      return;
    }

    const targetConn = targetNode.inputConnectionsByPin[targetPin];
    if (!targetConn) {
      return;
    }

    if (targetConn.nodeId !== sourceNodeId || targetConn.pin !== sourcePin) {
      return;
    }
    targetNode.inputConnectionsByPin[targetPin] = null;

    const outConns = sourceNode.outputConnectionsByPin[sourcePin];
    if (!outConns) {
      return;
    }

    const sourceConnIndex = outConns.findIndex(
      c => c.nodeId === targetNodeId && c.pin === targetPin
    );
    if (sourceConnIndex === -1) {
      return;
    }
    outConns.splice(sourceConnIndex, 1);

    // Evolve with the new inputs.
    evolveNode(state, targetNode);
  }
);

const interactNodeAction = produce(
  (state: SimulatorState, action: InteractNodeAction) => {
    const { nodeId } = action.payload;
    const { tick, nodesById, nodeStatesByNodeId, transitionWindows } = state;

    const node = nodesById[nodeId];
    const type = NodeTypes[node.type];
    if (!type || !type.interact) {
      return;
    }
    const evolution = type.interact(nodeStatesByNodeId[nodeId]);
    applyNodeEvolution(node, tick, evolution, nodeStatesByNodeId, transitionWindows);
    return;
  }
);

const evolveSimReducer = produce(
  (state: SimulatorState, action: EvolveSimAction) => {
    const { tickCount } = action.payload;
    const {
      tick,
      nodesById,
      nodeStatesByNodeId,
      nodeOutputValuesByNodeId,
      transitionWindows
    } = state;

    const endTick = tick + tickCount;

    // For each window within our update range...
    const windows = popWhile(transitionWindows, x => x.tick <= endTick);
    for (const window of windows) {
      const tick = window.tick;
      const evolveNodes = new Set<string>();

      // Update the current tick.  It will be referenced
      //  by evolveNode when determining when to schedule
      //  future transitions.
      state.tick = window.tick;

      // apply the transitions for this tick window.
      for (const transition of window.transitions) {
        const { nodeId, outputPinId, value } = transition;
        const node = nodesById[nodeId];
        if (!node) {
          continue;
        }

        if (nodeOutputValuesByNodeId[nodeId][outputPinId] !== value) {
          // Track what nodes we need to evolve as a result of this state change.
          nodeOutputValuesByNodeId[nodeId][outputPinId] = value;
          const targetNodes = node.outputConnectionsByPin[outputPinId];
          targetNodes.forEach(conn => evolveNodes.add(conn.nodeId));
        }
      }

      // Evolve affected nodes.
      for (const nodeId of evolveNodes) {
        evolveNode(state, nodeId);
      }
    }

    state.tick = endTick;
  }
);

export default function simulatorReducer(
  state: SimulatorState = defaultSimulatorState,
  action: Actions
): SimulatorState {
  switch (action.type) {
    case ACTION_NODE_ADD:
      return addNodeReducer(state, action);
    case ACTION_WIRE:
      return wireNodeReducer(state, action);
    case ACTION_UNWIRE:
      return unwireNodeReducer(state, action);
    case ACTION_TOGGLEWIRE:
      const {
        sourceNodeId,
        sourcePin,
        targetNodeId,
        targetPin
      } = action.payload;
      if (
        isWired(
          state.nodesById,
          { nodeId: sourceNodeId, pin: sourcePin },
          { nodeId: targetNodeId, pin: targetPin }
        )
      ) {
        return unwireNodeReducer(state, {
          type: ACTION_UNWIRE,
          payload: action.payload
        });
      } else {
        return wireNodeReducer(state, {
          type: ACTION_WIRE,
          payload: action.payload
        });
      }
    case ACTION_INTERACT:
      return interactNodeAction(state, action);
    case ACTION_EVOLVE:
      return evolveSimReducer(state, action);
  }
  return state;
}

/**
 * Determines the next transitions for a given node based on its current
 * inputs.
 */
function evolveNode(state: SimulatorState, node: string | Node): void {
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

function applyNodeEvolution(
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

function popWhile<T>(items: T[], pickWhile: (item: T) => boolean): T[] {
  const result = [];
  while (items.length > 0) {
    const item = items.pop()!;
    if (!pickWhile(item)) {
      items.unshift(item);
      break;
    }
    result.push(item);
  }

  return result;
}
