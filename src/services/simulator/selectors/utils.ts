import { AppState } from "@/store";
import { SimulatorState } from "../state";

export interface SimulatorSelectorA0<TReturn> {
  (s: AppState): TReturn;
  local(s: SimulatorState): TReturn;
}

export interface SimulatorSelectorA1<TA1, TReturn> {
  (s: AppState, a1: TA1): TReturn;
  local(s: SimulatorState, a1: TA1): TReturn;
}

const simulatorStateSelector = (s: AppState) => s.services.simulator;
export function createSimulatorSelector<TReturn>(
  selector: (s: SimulatorState) => TReturn
): SimulatorSelectorA0<TReturn>;
export function createSimulatorSelector<TA1, TReturn>(
  selector: (s: SimulatorState, a1: TA1) => TReturn
): SimulatorSelectorA1<TA1, TReturn>;
export function createSimulatorSelector<TArgs, TReturn>(
  selector: (s: SimulatorState, ...args: TArgs[]) => TReturn
): SimulatorSelectorA1<TArgs, TReturn> {
  const appSelector: any = (s: AppState, ...args: TArgs[]) =>
    selector(simulatorStateSelector(s), ...args);
  appSelector.local = selector;
  return appSelector;
}
