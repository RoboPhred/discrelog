export interface SelectionState {
  selectionType: null | "nodes" | "wires";
  selectedIds: string[];
}

const _defaultState: SelectionState = {
  selectionType: null,
  selectedIds: []
};

export const defaultSelectionState = Object.freeze(_defaultState);
