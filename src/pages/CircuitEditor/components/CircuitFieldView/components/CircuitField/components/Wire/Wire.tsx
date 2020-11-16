import * as React from "react";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import { wireJointIdsFromWireIdSelector } from "@/services/node-layout/selectors/wires";
import { isWireSelectedFromWireIdSelector } from "@/services/selection/selectors/selection";
import { wireValueFromWireIdSelector } from "@/services/simulator/selectors/wires";

import WireSegment from "../WireSegment";
import WireJoint from "../WireJoint";

import styles from "./Wire.module.css";

export interface WireProps {
  wireId: string;
}

const Wire: React.FC<WireProps> = ({ wireId }) => {
  const jointIds = useSelector((state) =>
    wireJointIdsFromWireIdSelector(state, wireId)
  );
  const isPowered = useSelector((state) =>
    wireValueFromWireIdSelector(state, wireId)
  );
  const isSelected = useSelector((state) =>
    isWireSelectedFromWireIdSelector(state, wireId)
  );

  // We need one extra array entry for starting on the last jointId and ending at null (end of wire)
  const segmentElements = [...jointIds, null].map((endJointId, index) => {
    const startJointId = index > 0 ? jointIds[index - 1] : null;
    return (
      <WireSegment
        key={index}
        wireId={wireId}
        startJointId={startJointId}
        endJointId={endJointId}
      />
    );
  });

  const jointElements = jointIds.map((jointId) => (
    <WireJoint key={jointId} jointId={jointId} />
  ));

  return (
    <g
      className={cls(
        styles["wire"],
        isPowered && styles["powered"],
        isSelected && styles["selected"]
      )}
    >
      {segmentElements}
      {jointElements}
    </g>
  );
};

export default Wire;
