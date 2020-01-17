import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { wireJointPositionSelector } from "@/services/field/selectors/wires";

interface WireJointProps {
  wireId: string;
  jointIndex: number;
  color: string;
  onMouseDown(jointIndex: number, e: React.MouseEvent): void;
}

const WireJoint: React.FC<WireJointProps> = ({
  wireId,
  jointIndex,
  color,
  onMouseDown
}) => {
  const position = useSelector(state =>
    wireJointPositionSelector(state, wireId, jointIndex)
  );
  const [mouseOver, setMouseOver] = React.useState(false);

  const onMouseOver = React.useCallback(() => {
    setMouseOver(true);
  }, []);
  const onMouseOut = React.useCallback(() => {
    setMouseOver(false);
  }, []);

  const mouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onMouseDown(jointIndex, e);
    },
    [jointIndex, onMouseDown]
  );

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={mouseOver ? 3 : 2}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseDown={mouseDown}
      fill={color}
    />
  );
};

export default WireJoint;
