import { ElementDefinition } from "../types";

interface ToggleState {
  toggleState: boolean;
}
const defaultToggleState: ToggleState = {
  toggleState: false,
};

/*
<svg width="50px" height="50px">
  <path d="M5,5 L45,5 L45,45 L5,45 z" id="element-outline" fill="#AFAFAF" stroke="black" stroke-width="1px" />
  <g id="element-on">
    <path d="M10,10 L40,10 L40,40 L10,40 z" id="element-on" fill="#00AF00" stroke="black" stroke-width="1px" />
    <text x="21" y="29" fill="white">1</text>
  </g>
  <g id="element-off">
    <path d="M10,10 L40,10 L40,40 L10,40 z" id="element-on" fill="#006F00" stroke="black" stroke-width="1px" />
    <text x="21" y="29" fill="white">0</text>
  </g>
</svg>
  */

const toggleElementDefinition: ElementDefinition = {
  type: "toggle",
  visual: {
    shapePath: [
      {
        path: "M5,5 L45,5 L45,45 L5,45 z",
        fill: "#AFAFAF",
        stroke: "black",
      },
      {
        path: "M10,10 L40,10 L40,40 L10,40 z",
        fill: (state: ToggleState) =>
          state.toggleState ? "lightgreen" : "darkgreen",
        stroke: "black",
      },
    ],
  },
  pins: {
    OUT: {
      name: "OUT",
      direction: "output",
      x: 45,
      y: 25,
    },
  },
  interact(state: ToggleState = defaultToggleState) {
    return {
      ...state,
      toggleState: !state.toggleState,
    };
  },
  evolve(state = defaultToggleState, inputs, tick) {
    return {
      state,
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: state.toggleState },
      },
    };
  },
};
export default toggleElementDefinition;
