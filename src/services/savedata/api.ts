import {
  SaveCircuit,
  SaveData,
  saveDataSchema,
  SaveElement,
  SaveWire,
} from "./types";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addElement } from "@/actions/element-add";
import { attachWire } from "@/actions/wire-attach";

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
  wireJointPositionsByJointIdSelector,
  wireJointIdsFromConnectionIdSelector,
} from "../circuit-layout/selectors/wires";

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

    function isImportableWire(wire: SaveWire) {
      return importNodes.some(
        ({ elementId }) =>
          wire.input.elementId === elementId ||
          wire.output.elementId === elementId
      );
    }

    const importWires = (save.wires ?? []).filter(isImportableWire);
    state = importWires.reduce(
      (state, wire) =>
        rootReducer(
          state,
          attachWire(wire.output, wire.input, { joints: wire.joints })
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
