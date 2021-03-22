import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { elementIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ElementPins from "./ElementPins";

const ElementPinsLayer: React.FC = React.memo(function ElementPinsLayer() {
  const { circuitId } = useCircuitEditor();
  const elementIds = useSelector((state) =>
    elementIdsFromCircuitIdSelector(state, circuitId)
  );

  const elements = elementIds.map((elementId) => (
    <ElementPins key={elementId} elementId={elementId} />
  ));

  return <g>{elements}</g>;
});

export default ElementPinsLayer;
