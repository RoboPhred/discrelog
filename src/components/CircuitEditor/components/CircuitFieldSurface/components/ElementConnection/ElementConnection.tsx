import * as React from "react";

import { cls } from "@/utils";
import useSelector from "@/hooks/useSelector";

import { connectionJointIdsFromConnectionIdSelector } from "@/services/circuit-layout/selectors/connections";
import { isConnectionSelectedFromConnectionIdSelector } from "@/services/selection/selectors/selection";
import { connectionValueFromConnectionIdSelector } from "@/services/simulator/selectors/connections";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";

import ConnectionSegment from "../ConnectionSegment";
import ConectionJoint from "../ConnectionJoint";

import styles from "./ElementConnection.module.css";

export interface ElementConnectionProps {
  connectionId: string;
}

const ElementConnection: React.FC<ElementConnectionProps> = React.memo(
  function ElementConnection({ connectionId }) {
    const { elementIdPath } = useCircuitEditor();

    const jointIds = useSelector((state) =>
      connectionJointIdsFromConnectionIdSelector(state, connectionId)
    );
    const isPowered = useSelector((state) =>
      connectionValueFromConnectionIdSelector(
        state,
        elementIdPath,
        connectionId
      )
    );
    const isSelected = useSelector((state) =>
      isConnectionSelectedFromConnectionIdSelector(state, connectionId)
    );

    // We need one extra array entry for starting on the last jointId and ending at null (end of connection)
    const segmentElements = [...jointIds, null].map((endJointId, index) => {
      const startJointId = index > 0 ? jointIds[index - 1] : null;
      return (
        <ConnectionSegment
          key={index}
          connectionId={connectionId}
          startJointId={startJointId}
          endJointId={endJointId}
        />
      );
    });

    const jointElements = jointIds.map((jointId) => (
      <ConectionJoint key={jointId} jointId={jointId} />
    ));

    return (
      <g
        className={cls(
          styles["element-connection"],
          isPowered && styles["powered"],
          isSelected && styles["selected"]
        )}
      >
        {segmentElements}
        {jointElements}
      </g>
    );
  }
);

export default ElementConnection;
