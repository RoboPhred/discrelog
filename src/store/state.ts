
import { SimulatorState, defaultSimulatorState } from "@/services/simulator/state";

import { CircuitEditorState, defaultCircuitEditorState } from "@/pages/CircuitEditor/state";

export interface State {
    services: {
        simulator: SimulatorState;
    }
    ui: {
        circuitEditor: CircuitEditorState
    }
}

export const defaultState: State = {
    services: {
        simulator: defaultSimulatorState
    },
    ui: {
        circuitEditor: defaultCircuitEditorState
    }
};
