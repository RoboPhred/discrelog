import {
  SaveCircuit,
  SaveData,
  saveDataSchema,
  SaveElement,
  SaveConnection,
} from "./types";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addElement } from "@/actions/element-add";
import { attachConnection } from "@/actions/connection-attach";

import {
  elementIdsSelector,
  elementFromElementIdSelector,
} from "../circuit-graph/selectors/elements";
import {
  connectionIdsSelector,
  connectionFromConnectionIdSelector,
} from "../circuit-graph/selectors/connections";
import { elementPositionFromElementIdSelector } from "../circuit-layout/selectors/element-positions";
import {
  circuitIdsSelector,
  circuitNameFromIdSelector,
} from "../circuit-properties/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import { circuitIdFromElementIdSelector } from "../circuit-graph/selectors/elements";
import {
  connectionJointPositionsByJointIdSelector,
  connectionJointIdsFromConnectionIdSelector,
} from "../circuit-layout/selectors/connections";

import { SaveFormatError } from "./errors";
import { addCircuit } from "@/actions/circuit-add";

export function createSave(state: AppState): SaveData {
  const jointPositions = connectionJointPositionsByJointIdSelector(state);
  return {
    circuits: circuitIdsSelector(state).map((circuitId) => {
      const circuitName = circuitNameFromIdSelector(state, circuitId);
      const saveCircuit: SaveCircuit = {
        circuitId,
        circuitName,
      };
      return saveCircuit;
    }),
    elements: elementIdsSelector(state).map((elementId) => {
      const element = elementFromElementIdSelector(state, elementId);
      const position = elementPositionFromElementIdSelector(state, elementId);
      const circuitId = circuitIdFromElementIdSelector(state, elementId);
      const saveElement: SaveElement = {
        elementId: elementId,
        elementType: element.elementType,
        elementName: element.elementName,
        circuitId: circuitId ?? ROOT_CIRCUIT_ID,
        x: position.x,
        y: position.y,
      };
      return saveElement;
    }),
    connections: connectionIdsSelector(state).map((connectionId) => {
      const conenction = connectionFromConnectionIdSelector(
        state,
        connectionId
      );
      const jointIds = connectionJointIdsFromConnectionIdSelector(
        state,
        connectionId
      );
      const saveConnection: SaveConnection = {
        input: conenction.inputPin,
        output: conenction.outputPin,
        joints: jointIds.map((jointId) => jointPositions[jointId]),
      };
      return saveConnection;
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

    state = (save.elements ?? []).reduce(
      (state, element) =>
        rootReducer(
          state,
          addElement(
            element.elementType,
            element.circuitId,
            { x: element.x, y: element.y },
            {
              elementId: element.elementId,
              elementName: element.elementName ?? undefined,
            }
          )
        ),
      state
    );

    state = (save.connections ?? []).reduce(
      (state, connection) =>
        rootReducer(
          state,
          attachConnection(connection.output, connection.input, {
            joints: connection.joints,
          })
        ),
      state
    );
  } catch (e) {
    console.error("Failed to rehydrate SaveData:", e);
    throw new SaveFormatError("Failed to load project.");
  }

  return state;
}

export function importCircuitsFromSave(
  state: AppState,
  circuitIds: string[],
  save: SaveData
): AppState {
  try {
    saveDataSchema.validateSync(save);
  } catch (e) {
    throw new SaveFormatError(e.message);
  }

  const existingCircuits = Object.keys(
    state.services.circuitProperties.circuitNamesByCircuitId
  );
  const importCircuits = save.circuits.filter(
    (c) =>
      circuitIds.indexOf(c.circuitId) !== -1 &&
      existingCircuits.indexOf(c.circuitId) === -1
  );
  if (importCircuits.length === 0) {
    return state;
  }

  try {
    state = importCircuits.reduce(
      (state, { circuitId, circuitName }) =>
        rootReducer(state, addCircuit({ circuitId, circuitName })),
      state
    );

    const importNodes = (save.elements ?? []).filter((x) =>
      importCircuits.some(({ circuitId }) => circuitId === x.circuitId)
    );
    state = importNodes.reduce(
      (state, element) =>
        rootReducer(
          state,
          addElement(
            element.elementType,
            element.circuitId,
            { x: element.x, y: element.y },
            {
              elementId: element.elementId,
              elementName: element.elementName ?? undefined,
            }
          )
        ),
      state
    );

    function isImportableConnection(connection: SaveConnection) {
      return importNodes.some(
        ({ elementId }) =>
          connection.input.elementId === elementId ||
          connection.output.elementId === elementId
      );
    }

    const importConnections = (save.connections ?? []).filter(
      isImportableConnection
    );
    state = importConnections.reduce(
      (state, connection) =>
        rootReducer(
          state,
          attachConnection(connection.output, connection.input, {
            joints: connection.joints,
          })
        ),
      state
    );
  } catch (e) {
    console.error("Failed to import circuit from SaveData:", e);
    throw new SaveFormatError("Failed to import circuit.");
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
