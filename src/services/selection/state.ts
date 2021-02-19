export interface SelectionServiceState {
  selectedNodeIds: string[];
  selectedConnectionIds: string[];
  selectedJointIds: string[];
}

const _defaultState: SelectionServiceState = {
  selectedNodeIds: [],
  selectedConnectionIds: [],
  selectedJointIds: [],
};

export const defaultSelectionServiceState = Object.freeze(_defaultState);
