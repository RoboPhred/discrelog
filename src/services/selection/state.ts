export interface SelectionState {
  selectedNodeIds: string[];
  selectedWireIds: string[];
}

const _defaultState: SelectionState = {
  selectedNodeIds: [],
  selectedWireIds: []
};

export const defaultSelectionState = Object.freeze(_defaultState);
