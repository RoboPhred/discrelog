import * as React from "react";
import { createSelector } from "reselect";
import pick from "lodash/pick";

import useSelector from "@/hooks/useSelector";

import { dragMoveOffsetSelector } from "@/services/circuit-editor-ui/selectors/drag";
import { selectedJointIdsSelector } from "@/services/selection/selectors/selection";
import { wireJointPositionsByJointIdSelector } from "@/services/node-layout/selectors/wires";
import values from "lodash/values";
import mapValues from "lodash/mapValues";
import WireJoint from "./WireJoint";
import WireJointVisual from "./WireJointVisual";

const selectedJointPositionsByIdSelector = createSelector(
  selectedJointIdsSelector,
  wireJointPositionsByJointIdSelector,
  (selectedJointIds, jointPositionsById) =>
    pick(jointPositionsById, selectedJointIds)
);

const DragJointPreviewLayer: React.FC = () => {
  const dragMoveOffset = useSelector(dragMoveOffsetSelector);
  const selectedNodePositionsById = useSelector(
    selectedJointPositionsByIdSelector
  );

  let elements: React.ReactNode | null = null;
  if (dragMoveOffset) {
    elements = values(selectedNodePositionsById).map((p, index) => (
      <WireJointVisual
        key={index}
        x={p.x + dragMoveOffset.x}
        y={p.y + dragMoveOffset.y}
        opacity={0.5}
      />
    ));
  }

  // TODO: Draw transparent lines connecting the joint.

  return (
    <g id="drag-joint-preview-layer" opacity={0.3}>
      {elements}
    </g>
  );
};

export default DragJointPreviewLayer;
