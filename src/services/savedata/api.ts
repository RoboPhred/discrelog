import {
  SaveCircuit,
  SaveData,
  saveDataSchema,
  SaveNode,
  SaveWire,
} from "./types";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";

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
import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import { circuitIdFromNodeIdSelector } from "../circuits/selectors/nodes";
import {
  wireJointPositionsByJointIdSelector,
  wireJointIdsFromConnectionIdSelector,
} from "../node-layout/selectors/wires";

import { SaveFormatError } from "./errors";
import { addCircuit } from "@/actions/circuit-add";

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
        nodeName: node.nodeName,
        circuitId: circuitId ?? ROOT_CIRCUIT_ID,
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

  // TODO: There may be some services that want to persist data across projects.
  state = defaultAppState;

  try {
    state = (save.circuits ?? []).reduce(
      (state, { circuitId, circuitName }) =>
        rootReducer(state, addCircuit({ circuitId, circuitName })),
      state
    );

    state = (save.nodes ?? []).reduce(
      (state, node) =>
        rootReducer(
          state,
          addNode(
            node.nodeType,
            node.circuitId,
            { x: node.x, y: node.y },
            {
              nodeId: node.nodeId,
              nodeName: node.nodeName ?? undefined,
            }
          )
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
