import { SaveData } from "./types";
import { AppState } from "@/store";
import { defaultSelectionState } from "../selection/state";
import { defaultSimulatorState } from "../simulator/state";

export function createSave(state: AppState): SaveData {
  return {
    field: state.services.field,
    graph: state.services.graph
  };
}

export function loadSave(state: AppState, save: SaveData): AppState {
  return {
    ...state,
    services: {
      ...state.services,
      field: save.field,
      graph: save.graph,
      selection: defaultSelectionState,
      simulator: defaultSimulatorState
    }
  };
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
