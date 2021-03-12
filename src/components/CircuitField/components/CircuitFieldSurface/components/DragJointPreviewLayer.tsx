import * as React from "react";
import { createSelector } from "reselect";
import pick from "lodash/pick";
import values from "lodash/values";

import useSelector from "@/hooks/useSelector";

import {
  dragMoveOffsetSelector,
  dragNewJointPositionSelector,
} from "@/services/circuit-editor-ui-drag/selectors/drag";
import { selectedJointIdsSelector } from "@/services/selection/selectors/selection";
import { wireJointPositionsByJointIdSelector } from "@/services/node-layout/selectors/wires";

import WireJointVisual from "./WireJointVisual";

const selectedJointPositionsByIdSelector = createSelector(
  selectedJointIdsSelector,
  wireJointPositionsByJointIdSelector,
  (selectedJointIds, jointPositionsById) =>
    pick(jointPositionsById, selectedJointIds)
);

const DragJointPreviewLayer: React.FC = React.memo(
  function DragJointPreviewLayer() {
    const dragMoveOffset = useSelector(dragMoveOffsetSelector);
    const selectedNodePositionsById = useSelector(
      selectedJointPositionsByIdSelector
    );

    const newJointPosition = useSelector(dragNewJointPositionSelector);

    let elements: React.ReactNode | null = null;
    if (dragMoveOffset) {
      elements = values(selectedNodePositionsById).map((p, index) => (
        <WireJointVisual
          key={index}
          interactable={false}
          x={p.x + dragMoveOffset.x}
          y={p.y + dragMoveOffset.y}
          opacity={0.5}
        />
      ));
    }

    let newJointElement: React.ReactNode | null = null;
    if (newJointPosition) {
      newJointElement = (
        <WireJointVisual
          interactable={false}
          x={newJointPosition.x}
          y={newJointPosition.y}
          opacity={0.5}
        />
      );
    }

    // TODO: Draw transparent lines connecting the joint.

    return (
      <g id="drag-joint-preview-layer" opacity={0.3}>
        {elements}
        {newJointElement}
      </g>
    );
  }
);

export default DragJointPreviewLayer;
