import { ROOT_CIRCUIT_ID } from "../circuits/constants";

import { DEFAULT_CIRCUIT_EDITOR_ID } from "./constants";

export interface CircuitEditorState {
  circuitId: string;
  elementIdPath: string[];
}

export interface CircuitEditorsServiceState {
  circucitEditorsById: Record<string, CircuitEditorState>;
  activeEditorId: string | null;
}

const _defaultState: CircuitEditorsServiceState = {
  circucitEditorsById: {
    [DEFAULT_CIRCUIT_EDITOR_ID]: {
      circuitId: ROOT_CIRCUIT_ID,
      elementIdPath: [],
    },
  },
  activeEditorId: null,
};

export const defaultCircuitEditorServiceState = Object.freeze(_defaultState);
