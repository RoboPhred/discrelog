import * as React from "react";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import { wireJointIdsFromConnectionIdSelector } from "@/services/node-layout/selectors/wires";
import { isWireSelectedFromConnectionIdSelector } from "@/services/selection/selectors/selection";
import { wireValueFromConnectionIdSelector } from "@/services/simulator/selectors/wires";

import { useCircuitField } from "../../../../circuit-field-context";

import WireSegment from "../WireSegment";
import WireJoint from "../WireJoint";

import styles from "./Wire.module.css";

export interface WireProps {
  connectionId: string;
}

const Wire: React.FC<WireProps> = React.memo(function Wire({ connectionId }) {
  const { circuitNodePath } = useCircuitField();

  const jointIds = useSelector((state) =>
    wireJointIdsFromConnectionIdSelector(state, connectionId)
  );
  const isPowered = useSelector((state) =>
    wireValueFromConnectionIdSelector(state, circuitNodePath, connectionId)
  );
  const isSelected = useSelector((state) =>
    isWireSelectedFromConnectionIdSelector(state, connectionId)
  );

  // We need one extra array entry for starting on the last jointId and ending at null (end of wire)
  const segmentElements = [...jointIds, null].map((endJointId, index) => {
    const startJointId = index > 0 ? jointIds[index - 1] : null;
    return (
      <WireSegment
        key={index}
        connectionId={connectionId}
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
});

export default Wire;
