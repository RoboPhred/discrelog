import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { elementIdsFromCircuitIdSelector } from "@/services/circuits/selectors/elements";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import Element from "./Element";

const ElementsLayer: React.FC = React.memo(function ElementsLayer() {
  const { circuitId } = useCircuitEditor();
  const elementIds = useSelector((state) =>
    elementIdsFromCircuitIdSelector(state, circuitId)
  );

  const elements = elementIds.map((elementId) => {
    return <Element key={elementId} elementId={elementId} />;
  });

  return <g>{elements}</g>;
});
export default ElementsLayer;
