import { SaveData, SaveNode, SaveWire } from "./types";

import { AppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";

import { defaultSelectionState } from "../selection/state";
import { defaultSimulatorState } from "../simulator/state";
import { defaultGraphState } from "../graph/state";
import {
  nodeIdsSelector,
  nodeFromNodeIdSelector,
} from "../graph/selectors/nodes";
import {
  wireIdsSelector,
  wireFromWireIdSelector,
} from "../graph/selectors/wires";
import { nodePositionFromNodeIdSelector } from "../field/selectors/positions";
import {
  wireJointPositionsByJointIdSelector,
  wireJointIdsFromWireIdSelector,
} from "../field/selectors/wires";
import { defaultFieldState } from "../field/state";

export function createSave(state: AppState): SaveData {
  const jointPositions = wireJointPositionsByJointIdSelector(state);
  return {
    nodes: nodeIdsSelector(state).map((nodeId) => {
      const node = nodeFromNodeIdSelector(state, nodeId);
      const position = nodePositionFromNodeIdSelector(state, nodeId);
      const saveNode: SaveNode = {
        id: node.id,
        type: node.type,
        x: position.x,
        y: position.y,
      };
      return saveNode;
    }),
    wires: wireIdsSelector(state).map((wireId) => {
      const wire = wireFromWireIdSelector(state, wireId);
      const jointIds = wireJointIdsFromWireIdSelector(state, wireId);
      const saveWire: SaveWire = {
        input: wire.inputPin,
        output: wire.outputPin,
        joints: jointIds.map((jointId) => jointPositions[jointId]),
      };
      return saveWire;
    }),
  };
}

export function loadSave(state: AppState, save: SaveData): AppState {
  state = {
    ...state,
    services: {
      ...state.services,
      field: defaultFieldState,
      graph: defaultGraphState,
      selection: defaultSelectionState,
      simulator: defaultSimulatorState,
    },
  };

  const fallbackState = state;

  try {
    state = save.nodes.reduce(
      (state, node) =>
        rootReducer(
          state,
          addNode(node.type, {
            nodeId: node.id,
            position: { x: node.x, y: node.y },
          })
        ),
      state
    );

    state = save.wires.reduce(
      (state, wire) =>
        rootReducer(
          state,
          attachWire(wire.output, wire.input, { joints: wire.joints })
        ),
      state
    );
  } catch {
    // TODO: Notify user of load error.
    return fallbackState;
  }

  return state;
}

export function storeAutosave(save: SaveData): void {
  localStorage.setItem("autosave", JSON.stringify(save));
}

export function loadAutosave(): SaveData | null {
  const str = localStorage.getItem("autosave");
  if (!str) {
    return null;
  }

  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export function deleteAutosave() {
  localStorage.removeItem("autosave");
}
