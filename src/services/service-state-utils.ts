import { AnyAction, Reducer } from "redux";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";

export type ServiceKey = keyof AppState["services"];
export type ServiceState<
  TServiceKey extends ServiceKey
> = AppState["services"][TServiceKey];

export interface ServiceReducer<TServiceState> {
  (
    state: Readonly<TServiceState>,
    action: AnyAction,
    appState: AppState
  ): TServiceState;
}

export function createServiceReducerCreator<TServiceKey extends ServiceKey>(
  service: TServiceKey
): (
  reducer: ServiceReducer<AppState["services"][TServiceKey]>
) => Reducer<AppState, AnyAction> {
  return (reducer: ServiceReducer<AppState["services"][TServiceKey]>) => {
    return (state: AppState = defaultAppState, action: AnyAction) => {
      const newState = reducer(state.services[service], action, state);
      if (state.services[service] != newState) {
        return fpSet(state, "services", service, newState);
      }
      return state;
    };
  };
}

export interface ServiceSelectorA0<TServiceKey extends ServiceKey, TReturn> {
  (s: AppState): TReturn;
  local(s: ServiceState<TServiceKey>): TReturn;
}

export interface ServiceSelectorA1<
  TServiceKey extends ServiceKey,
  TA1,
  TReturn
> {
  (s: AppState, a1: TA1): TReturn;
  local(s: ServiceState<TServiceKey>, a1: TA1): TReturn;
}

export interface ServiceSelectorA2<
  TServiceKey extends ServiceKey,
  TA1,
  TA2,
  TReturn
> {
  (s: AppState, a1: TA1, a2: TA2): TReturn;
  local(s: ServiceState<TServiceKey>, a1: TA1, a2: TA2): TReturn;
}

export interface ServiceSelectorCreator<TServiceKey extends ServiceKey> {
  <TReturn>(
    selector: (s: ServiceState<TServiceKey>) => TReturn
  ): ServiceSelectorA0<TServiceKey, TReturn>;
  <TA1, TReturn>(
    selector: (s: ServiceState<TServiceKey>, a1: TA1) => TReturn
  ): ServiceSelectorA1<TServiceKey, TA1, TReturn>;
  <TA1, TA2, TReturn>(
    selector: (s: ServiceState<TServiceKey>, a1: TA1, a2: TA2) => TReturn
  ): ServiceSelectorA2<TServiceKey, TA1, TA2, TReturn>;
}

export function createServiceSelectorCreator<TServiceKey extends ServiceKey>(
  service: TServiceKey
): ServiceSelectorCreator<TServiceKey> {
  return <TArgs, TReturn>(
    selector: (s: ServiceState<TServiceKey>, ...args: TArgs[]) => TReturn
  ) => {
    const appSelector: any = (s: AppState, ...args: TArgs[]) =>
      selector(s.services[service], ...args);
    appSelector.local = selector;
    return appSelector;
  };
}
