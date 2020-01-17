export interface SelectionState {
  selectedNodeIds: string[];
  selectedWireIds: string[];
  selectedJointIds: string[];
}

const _defaultState: SelectionState = {
  selectedNodeIds: [],
  selectedWireIds: [],
  selectedJointIds: []
};

export const defaultSelectionState = Object.freeze(_defaultState);
