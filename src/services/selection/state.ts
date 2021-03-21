export interface SelectionServiceState {
  selectedElementIds: string[];
  selectedConnectionIds: string[];
  selectedJointIds: string[];
}

const _defaultState: SelectionServiceState = {
  selectedElementIds: [],
  selectedConnectionIds: [],
  selectedJointIds: [],
};

export const defaultSelectionServiceState = Object.freeze(_defaultState);
