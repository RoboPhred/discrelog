import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { elementDefinitionFromElementIdSelector } from "@/services/circuit-graph/selectors/element-def";

import ElementPin from "./ElementPin";

export interface NodePinsProps {
  elementId: string;
}

const ElementPins: React.FC<NodePinsProps> = React.memo(function ElementPins({
  elementId,
}) {
  const def = useSelector((state) =>
    elementDefinitionFromElementIdSelector(state, elementId)
  );

  const pins = def?.pins ?? {};

  const elements = Object.keys(pins).map((pinId) => (
    <ElementPin key={pinId} elementId={elementId} pinId={pinId} />
  ));

  return <>{elements}</>;
});

export default ElementPins;
