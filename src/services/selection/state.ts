export interface SelectionState {
  selectedNodeIds: string[];
  selectedConnectionIds: string[];
  selectedJointIds: string[];
}

const _defaultState: SelectionState = {
  selectedNodeIds: [],
  selectedConnectionIds: [],
  selectedJointIds: [],
};

export const defaultSelectionState = Object.freeze(_defaultState);
