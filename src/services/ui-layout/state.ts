import { TesselValue } from "@/components/Tessel";

export interface UiLayoutServiceState {
  /**
   * The tessel layout.
   */
  layout: TesselValue;
}

const _defaultState: UiLayoutServiceState = {
  layout: {
    direction: "row",
    division: {
      firstSize: 200,
    },
    first: {
      direction: "column",
      division: 30,
      first: "circuits-list",
      second: "node-tray",
    },
    second: "circuit-field",
  },
};

export const defaultUiLayoutServiceState = Object.freeze(_defaultState);
