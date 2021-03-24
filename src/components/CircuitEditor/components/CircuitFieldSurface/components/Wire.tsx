import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { wireSegmentIdsFromWireIdSelector } from "@/services/circuit-graph/selectors/wires";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";
import { getWireHtmlId } from "../../../ids";

import WireSegment from "./WireSegment";

export interface WireProps {
  wireId: string;
}

const Wire: React.FC<WireProps> = ({ wireId }) => {
  const { editorId } = useCircuitEditor();
  const wireSegmentIds = useSelector((state) =>
    wireSegmentIdsFromWireIdSelector(state, wireId)
  );

  // FIXME WIRE: render wire joints.

  const elements = wireSegmentIds.map((id) => (
    <WireSegment key={id} wireId={wireId} wireSegmentId={id} />
  ));
  return <g id={getWireHtmlId(editorId, wireId)}>{elements}</g>;
};

export default Wire;
