import * as React from "react";
import { v4 as uuidV4 } from "uuid";

import useSelector from "@/hooks/useSelector";

import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";
import { wireSegmentIdFromElementPinSelector } from "@/services/circuit-graph/selectors/wires";
import { wireLineCandidatesForSegmentId } from "@/services/circuit-graph/selectors/lines";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import SubMenuItem from "@/components/Menus/SubMenuItem";
import { useDispatch } from "react-redux";
import { wireSegmentSetLine } from "@/actions/wire-segment-set-line";

export interface PinContextMenuProps {
  elementId: string;
  pinId: string;
}

const PinContextMenu: React.FC<PinContextMenuProps> = ({
  elementId,
  pinId,
}) => {
  const direction = useSelector((state) =>
    pinDirectionFromElementPinSelector(state, elementId, pinId)
  );

  const segmentId = useSelector((state) =>
    wireSegmentIdFromElementPinSelector(state, elementId, pinId)
  );

  if (!direction || !segmentId) {
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
      <MenuItem
        onClick={() => dispatch(wireSegmentSetLine(segmentId, uuidV4()))}
      >
        New {direction === "input" ? "Input" : "Output"}
      </MenuItem>
      {candidates.map(({ lineId, name }) => (
        <MenuItem
          key={lineId}
          onClick={() => dispatch(wireSegmentSetLine(segmentId, lineId))}
        >
          {name}
        </MenuItem>
      ))}
    </Menu>
  );
};
