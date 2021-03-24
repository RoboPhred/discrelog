export interface SelectionServiceState {
  selectedElementIds: string[];
  selectedJointIds: string[];
}

const _defaultState: SelectionServiceState = {
  selectedElementIds: [],
  selectedJointIds: [],
};

export const defaultSelectionServiceState = Object.freeze(_defaultState);
