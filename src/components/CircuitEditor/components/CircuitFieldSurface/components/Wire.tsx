import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  wireJointIdsFromWireIdSelector,
  wireSegmentIdsFromWireIdSelector,
} from "@/services/circuit-graph/selectors/wires";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";
import { getWireHtmlId } from "../../../ids";

import WireSegment from "./WireSegment";
import WireJoint from "./WireJoint";

export interface WireProps {
  wireId: string;
}

const Wire: React.FC<WireProps> = ({ wireId }) => {
  const { editorId } = useCircuitEditor();
  const wireSegmentIds = useSelector((state) =>
    wireSegmentIdsFromWireIdSelector(state, wireId)
  );
  const wireJointIds = useSelector((state) =>
    wireJointIdsFromWireIdSelector(state, wireId)
  );

  const segmentElements = wireSegmentIds.map((id) => (
    <WireSegment key={id} wireId={wireId} wireSegmentId={id} />
  ));

  // TODO: Might want to render joints on a new layer so they are always rendered above other wire segments
  const jointElements = wireJointIds.map((id) => (
    <WireJoint key={id} wireId={wireId} jointId={id} />
  ));

  return (
    <g id={getWireHtmlId(editorId, wireId)}>
      {segmentElements}
      {jointElements}
    </g>
  );
};

export default Wire;
