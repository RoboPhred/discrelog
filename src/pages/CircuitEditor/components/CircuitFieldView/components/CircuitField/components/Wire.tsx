import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";

import { selectWires } from "@/actions/select-wires";

import { wireJointIdsSelector } from "@/services/field/selectors/wires";
import { isWireSelectedSelector } from "@/services/selection/selectors/selection";
import { wireValueSelector } from "@/services/simulator/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

import WireSegment from "./WireSegment";
import WireJoint from "./WireJoint";

export interface WireProps {
  wireId: string;
}

const Wire: React.FC<WireProps> = ({ wireId }) => {
  const jointIds = useSelector(state => wireJointIdsSelector(state, wireId));
  const value = useSelector(state => wireValueSelector(state, wireId));
  const isSelected = useSelector(state =>
    isWireSelectedSelector(state, wireId)
  );

  let color: string;
  if (isSelected) {
    color = "yellow";
  } else if (value) {
    color = "green";
  } else {
    color = "black";
  }

  // We need one extra array entry for starting on the last jointId and ending at null (end of wire)
  const segmentElements = [...jointIds, null].map((endJointId, index) => {
    const startJointId = index > 0 ? jointIds[index - 1] : null;
    return (
      <WireSegment
        key={index}
        wireId={wireId}
        startJointId={startJointId}
        endJointId={endJointId}
        color={color}
      />
    );
  });

  const jointElements = jointIds.map(jointId => (
    <WireJoint key={jointId} jointId={jointId} />
  ));

  return (
    <>
      {segmentElements}
      {jointElements}
    </>
  );
};

export default Wire;
