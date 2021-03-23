import * as React from "react";

import useSelector from "@/hooks/useSelector";

import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "@/services/circuit-layout/selectors/wires";

export interface WireSegmentProps {
  wireSegmentId: string;
}

const WireSegment: React.FC<WireSegmentProps> = ({ wireSegmentId }) => {
  const startPos = useSelector((state) =>
    startPositionByWireSegmentId(state, wireSegmentId)
  );
  const endPos = useSelector((state) =>
    endPositionByWireSegmentId(state, wireSegmentId)
  );

  return (
    <line
      x1={startPos.x}
      x2={endPos.x}
      y1={startPos.y}
      y2={endPos.y}
      // TODO: Color if power is flowing in this segment and sim is active.
      // Do this with css.
      stroke="black"
      // TODO: Thicker wires when more than one input is attached
      strokeWidth={2}
    />
  );
};

export default WireSegment;
