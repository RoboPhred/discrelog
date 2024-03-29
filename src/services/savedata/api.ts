import { isTruthy } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { addElement } from "@/actions/element-add";
import { addCircuit } from "@/actions/circuit-add";
import { hydrateWire } from "@/actions/wire-hydrate";

import { circuitIdFromElementIdSelector } from "../circuit-graph/selectors/elements";
import {
  elementIdsSelector,
  elementFromElementIdSelector,
} from "../circuit-graph/selectors/elements";
import { wireSegmentHasInput } from "../circuit-graph/types";
import {
  circuitIdForWireIdSelector,
  wireIdsSelector,
  wireJointIdsByWireIdSelector,
  wireSegmentByWireSegmentIdSelector,
  wireSegmentIdsFromWireIdSelector,
} from "../circuit-graph/selectors/wires";
import { elementPositionFromElementIdSelector } from "../circuit-layout/selectors/element-positions";
import { wireJointPositionByJointIdSelector } from "../circuit-graph/selectors/wire-positions";
import {
  circuitIdsSelector,
  circuitNameFromIdSelector,
} from "../circuit-properties/selectors/circuits";
import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import {
  SaveCircuit,
  SaveData,
  SaveElement,
  SaveWire,
  SaveWireSegment,
  validateSaveData,
} from "./types";

import { SaveFormatError } from "./errors";

export function createSave(state: AppState): SaveData {
  const jointPositionsByJointId = wireJointPositionByJointIdSelector(state);
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
    wires: wireIdsSelector(state)
      .map((wireId) => {
        const jointIds = wireJointIdsByWireIdSelector(state, wireId);
        const circuitId = circuitIdForWireIdSelector(state, wireId);
        if (!circuitId) {
          return null;
        }
        const saveWire: SaveWire = {
          wireId,
          circuitId,
          wireSegments: wireSegmentIdsFromWireIdSelector(state, wireId).map(
            (wireSegmentId) => {
              const segment = wireSegmentByWireSegmentIdSelector(
                state,
                wireSegmentId
              )!;
              const saveWireSegment: SaveWireSegment = {
                wireSegmentId,
                ...segment,
              };
              return saveWireSegment;
            }
          ),
          wireJoints: jointIds.map((jointId) => ({
            jointId,
            ...jointPositionsByJointId[jointId],
          })),
        };
        return saveWire;
      })
      .filter(isTruthy),
  };
}

export function loadSave(state: AppState, save: SaveData): AppState {
  try {
    validateSaveData(save);
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
      (state, wire) => rootReducer(state, hydrateWire(wire)),
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
    validateSaveData(save);
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

    const importElements = (save.elements ?? []).filter((x) =>
      importCircuits.some(({ circuitId }) => circuitId === x.circuitId)
    );
    state = importElements.reduce(
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
      return wire.wireSegments.some((segment) => {
        if (!wireSegmentHasInput(segment)) {
          return;
        }
        const { inputPin } = segment;
        return importElements.some(
          (element) => element.elementId === inputPin.elementId
        );
      });
    }

    const importWires = (save.wires ?? []).filter(isImportableWire);
    state = importWires.reduce(
      (state, wire) => rootReducer(state, hydrateWire(wire)),
      state
    );
  } catch (e) {
    console.error("Failed to import circuit from SaveData:", e);
    throw new SaveFormatError("Failed to import circuit.");
  }

  return state;
}
