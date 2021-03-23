import * as React from "react";

import useSelector from "@/hooks/useSelector";

export interface WireSegmentProps {
  wireSegmentId: string;
}

const WireSegment: React.FC<WireSegmentProps> = ({ wireSegmentId }) => {
  // TODO: Render line from start of segment to end.
  return (
    <line x1={0} x2={100} y1={0} y2={100} stroke="black" strokeWidth={2} />
  );
};

export default WireSegment;
