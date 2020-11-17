import { SaveData, saveDataSchema, SaveNode, SaveWire } from "./types";

import { AppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addElement } from "@/actions/element-add";
import { attachWire } from "@/actions/wire-attach";

import { defaultSelectionState } from "../selection/state";
import { defaultSimulatorState } from "../simulator/state";
import { defaultCircuitGraphState } from "../circuit-graph/state";
import {
  nodeIdsSelector,
  nodeFromNodeIdSelector,
} from "../circuit-graph/selectors/nodes";
import {
  connectionIdsSelector,
  connectionFromConnectionIdSelector,
} from "../circuit-graph/selectors/connections";
import { nodePositionFromNodeIdSelector } from "../circuit-layout/selectors/node-positions";
import {
  wireJointPositionsByJointIdSelector,
  wireJointIdsFromConnectionIdSelector,
} from "../circuit-layout/selectors/wires";
import { defaultCircuitLayoutState } from "../circuit-layout/state";
import { SaveFormatError } from "./errors";

export function createSave(state: AppState): SaveData {
  const jointPositions = wireJointPositionsByJointIdSelector(state);
  return {
    nodes: nodeIdsSelector(state).map((nodeId) => {
      const node = nodeFromNodeIdSelector(state, nodeId);
      const position = nodePositionFromNodeIdSelector(state, nodeId);
      const saveNode: SaveNode = {
        nodeId: nodeId,
        elementType: node.elementType,
        x: position.x,
        y: position.y,
      };
      return saveNode;
    }),
    wires: connectionIdsSelector(state).map((connectionId) => {
      const wire = connectionFromConnectionIdSelector(state, connectionId);
      const jointIds = wireJointIdsFromConnectionIdSelector(
        state,
        connectionId
      );
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
  try {
    saveDataSchema.validateSync(save);
  } catch (e) {
    throw new SaveFormatError(e.message);
  }

  state = {
    ...state,
    services: {
      ...state.services,
      circuitLayout: defaultCircuitLayoutState,
      circuitGraph: defaultCircuitGraphState,
      selection: defaultSelectionState,
      simulator: defaultSimulatorState,
    },
  };

  try {
    state = save.nodes.reduce(
      (state, node) =>
        rootReducer(
          state,
          // TODO: Could be element, could be chip.
          addElement(node.elementType, {
            nodeId: node.nodeId,
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
  } catch (e) {
    console.error("Failed to rehydrate SaveData:", e);
    throw new SaveFormatError("Failed to load project.");
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
