import { createShapePathNode } from "../../components/ShapePathNode";
import { NodeDefinition } from "../../types";

// Shape path from https://en.wikipedia.org/wiki/XOR_gate#/media/File:XOR_ANSI.svg

const orNodeDefinition: NodeDefinition = {
  type: "logic-xor",
  elementProduction: "xor",
  visual: {
    hitPath: `M24.09375 5l2 2.4375S31.75 14.43755 31.75 25s-5.65625 17.5625-5.65625 17.5625l-2 2.4375H41.25c2.40808 0 7.6897.02451 13.625-2.40625s12.53654-7.34327 17.6875-16.875L71.25 25l1.3125-.71875C62.25939 5.21559 46.00657 5 41.25 5H24.09375z`,
    component: createShapePathNode([
      `
      M70 25h25
      M30.38572 15H5
      M31.3621 35H5
      `,
      {
        path: `M24.25 42C22.65263 44.6444 22 45 22 45h-3.65625l2-2.4375S26 35.56245 26 25 20.34375 7.4375 20.34375 7.4375l-2-2.4375H22c.78125.9375 1.42188 1.65625 2.21875 3C26.09147 11.09981 29 17.02665 29 25c0 7.95065-2.8967 13.87942-4.75 17z`,
        strokeWidth: 0,
        fill: "black",
      },
      {
        path: `M24.09375 5l2 2.4375S31.75 14.43755 31.75 25s-5.65625 17.5625-5.65625 17.5625l-2 2.4375H41.25c2.40808 0 7.6897.02451 13.625-2.40625s12.53654-7.34327 17.6875-16.875L71.25 25l1.3125-.71875C62.25939 5.21559 46.00657 5 41.25 5H24.09375zm5.875 3H41.25c4.68417 0 18.28685-.1302 27.96875 17C64.45196 33.42907 58.69747 37.68391 53.5 39.8125 48.13934 42.00792 43.65808 42 41.25 42H30c1.87359-3.10843 4.75-9.04935 4.75-17 0-7.97335-2.90853-13.90019-4.78125-17z`,
        strokeWidth: 0,
        fill: "black",
      },
    ]),
  },
  pins: {
    A: {
      direction: "input",
      x: 0,
      y: 14.5,
    },
    B: {
      direction: "input",
      x: 0,
      y: 35,
    },
    OUT: {
      direction: "output",
      x: 100,
      y: 25,
    },
  },
};
export default orNodeDefinition;
