import * as React from "react";

import { cls } from "@/utils";

import styles from "./ConnectionJointVisual.module.css";

interface ConnectionJointVisualProps extends React.SVGProps<SVGCircleElement> {
  x: number;
  y: number;
  interactable?: boolean;
  selected?: boolean;
}

const ConnectionJointVisual: React.FC<ConnectionJointVisualProps> = ({
  x,
  y,
  interactable = true,
  selected = false,
  ...props
}) => {
  const [mouseOver, setMouseOver] = React.useState(false);

  const onMouseOver = React.useCallback(() => {
    if (!interactable) {
      return;
    }
    setMouseOver(true);
  }, [interactable]);

  const onMouseOut = React.useCallback(() => {
    setMouseOver(false);
  }, []);

  return (
    <circle
      className={cls(
        styles["connection-joint"],
        selected && styles["selected"]
      )}
      cx={x}
      cy={y}
      r={(interactable && mouseOver) || selected ? 4 : 2}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      {...props}
    />
  );
};

export default ConnectionJointVisual;
