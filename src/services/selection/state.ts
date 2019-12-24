export interface SelectionState {
  selectedNodeIds: string[];
}

const _defaultState: SelectionState = {
  selectedNodeIds: []
};

export const defaultSelectionState = Object.freeze(_defaultState);
