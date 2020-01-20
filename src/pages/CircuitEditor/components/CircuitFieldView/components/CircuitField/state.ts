import { NodePin } from "@/services/graph/types";

export interface CircuitFieldState {
  selectedPin: NodePin | null;
}

const _defaultState: CircuitFieldState = {
  selectedPin: null
};

export const defaultCircuitFieldState = Object.freeze(_defaultState);
