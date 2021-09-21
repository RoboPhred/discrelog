import * as React from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidV4 } from "uuid";

import useSelector from "@/hooks/useSelector";

import { wireSegmentSetLine } from "@/actions/wire-segment-set-line";

import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";
import { wireSegmentIdFromElementPinSelector } from "@/services/circuit-graph/selectors/wires";
import { wireLineCandidatesForSegmentId } from "@/services/circuit-graph/selectors/lines";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import Menu from "@/components/Menus/Menu";
import CheckboxMenuItem from "@/components/Menus/CheckboxMenuItem";
import SubMenuItem from "@/components/Menus/SubMenuItem";

export interface PinContextMenuProps {
  elementId: string;
  pinId: string;
}

const PinContextMenu: React.FC<PinContextMenuProps> = ({
  elementId,
  pinId,
}) => {
  const isSimActive = useSelector(isSimActiveSelector);

  const direction = useSelector((state) =>
    pinDirectionFromElementPinSelector(state, elementId, pinId)
  );

  const segmentId = useSelector((state) =>
    wireSegmentIdFromElementPinSelector(state, elementId, pinId)
  );

  if (isSimActive || !direction || !segmentId) {
    return null;
  }

  return (
    <Menu>
      <SubMenuItem
        content={<SetLineIdMenu segmentId={segmentId} direction={direction} />}
      >
        Set {direction === "input" ? "Input" : "Output"}
      </SubMenuItem>
    </Menu>
  );
};

export default PinContextMenu;

interface SetLineIdMenuProps {
  direction: "input" | "output";
  segmentId: string;
}
const SetLineIdMenu: React.FC<SetLineIdMenuProps> = ({
  segmentId,
  direction,
}) => {
  const dispatch = useDispatch();

  const candidates = useSelector((state) =>
    wireLineCandidatesForSegmentId(state, segmentId)
  );
  return (
    <Menu>
      <CheckboxMenuItem
        value={false}
        onChange={() => dispatch(wireSegmentSetLine(segmentId, uuidV4()))}
      >
        New {direction === "input" ? "Input" : "Output"}
      </CheckboxMenuItem>
      {candidates.map(({ lineId, name, selected }) => (
        <CheckboxMenuItem
          key={lineId}
          value={selected}
          onChange={() => dispatch(wireSegmentSetLine(segmentId, lineId))}
        >
          {name}
        </CheckboxMenuItem>
      ))}
    </Menu>
  );
};
