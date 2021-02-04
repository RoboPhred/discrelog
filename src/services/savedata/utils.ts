import {
  SaveCircuit,
  SaveData,
  saveDataSchema,
  SaveNode,
  SaveWire,
} from "./types";

import { AppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";

import { defaultSelectionState } from "../selection/state";
import { defaultSimulatorState } from "../simulator/state";
import { defaultNodeGraphState } from "../node-graph/state";

import {
  nodeIdsSelector,
  nodeFromNodeIdSelector,
} from "../node-graph/selectors/nodes";
import {
  connectionIdsSelector,
  connectionFromConnectionIdSelector,
} from "../node-graph/selectors/connections";
import { nodePositionFromNodeIdSelector } from "../node-layout/selectors/node-positions";
import {
  circuitIdsSelector,
  circuitNameFromIdSelector,
} from "../circuits/selectors/circuits";
import { circuitIdFromNodeIdSelector } from "../circuits/selectors/nodes";
import {
  wireJointPositionsByJointIdSelector,
  wireJointIdsFromConnectionIdSelector,
} from "../node-layout/selectors/wires";
import { defaultNodeLayoutState } from "../node-layout/state";

import { SaveFormatError } from "./errors";
import { newCircuit } from "@/actions/circuit-new";

export function createSave(state: AppState): SaveData {
  const jointPositions = wireJointPositionsByJointIdSelector(state);
  return {
    circuits: circuitIdsSelector(state).map((circuitId) => {
      const circuitName = circuitNameFromIdSelector(state, circuitId);
      const saveCircuit: SaveCircuit = {
        circuitId,
        circuitName,
      };
      return saveCircuit;
    }),
    nodes: nodeIdsSelector(state).map((nodeId) => {
      const node = nodeFromNodeIdSelector(state, nodeId);
      const position = nodePositionFromNodeIdSelector(state, nodeId);
      const circuitId = circuitIdFromNodeIdSelector(state, nodeId);
      const saveNode: SaveNode = {
        nodeId: nodeId,
        nodeType: node.nodeType,
        circuitId: circuitId ?? "root",
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
      nodeLayout: defaultNodeLayoutState,
      nodeGraph: defaultNodeGraphState,
      selection: defaultSelectionState,
      simulator: defaultSimulatorState,
    },
  };

  try {
    state = (save.circuits ?? []).reduce(
      (state, { circuitId, circuitName }) =>
        rootReducer(state, newCircuit({ circuitId, circuitName })),
      state
    );

    state = (save.nodes ?? []).reduce(
      (state, node) =>
        rootReducer(
          state,
          addNode(node.nodeType, {
            nodeId: node.nodeId,
            circuitId: node.circuitId,
            position: { x: node.x, y: node.y },
          })
        ),
      state
    );

    state = (save.wires ?? []).reduce(
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
