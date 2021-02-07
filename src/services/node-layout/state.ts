import { Point } from "@/geometry";

export interface NodeLayoutState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByConnectionId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: NodeLayoutState = {
  nodePositionsById: {},
  wireJointIdsByConnectionId: {},
  wireJointPositionsByJointId: {},
};

export const defaultNodeLayoutState: Readonly<NodeLayoutState> = Object.freeze(
  _defaultState
);
