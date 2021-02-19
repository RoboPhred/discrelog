import { Point } from "@/geometry";

export interface NodeLayoutServiceState {
  nodePositionsById: Record<string, Point>;
  wireJointIdsByConnectionId: Record<string, string[]>;
  wireJointPositionsByJointId: Record<string, Point>;
}

const _defaultState: NodeLayoutServiceState = {
  nodePositionsById: {},
  wireJointIdsByConnectionId: {},
  wireJointPositionsByJointId: {},
};

export const defaultNodeLayoutServiceState: Readonly<NodeLayoutServiceState> = Object.freeze(
  _defaultState
);
