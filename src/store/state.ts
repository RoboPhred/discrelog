
import { SimulatorState, defaultSimulatorState } from "../services/simulator/state";

export interface State {
    simulator: SimulatorState;
}

export const defaultState: State = {
    simulator: defaultSimulatorState
};
