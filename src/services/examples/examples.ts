import { Example } from "./types";

const requireExample = require.context("../../examples", true, /index\.ts$/);

const examples: Record<string, Example> = {};
requireExample.keys().forEach((key) => {
  examples[key] = requireExample(key).default;
});

console.log(examples);

export default examples;
