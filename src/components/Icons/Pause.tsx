import * as React from "react";

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width={16} height={16} {...props}>
      <path d="M2.5,1 L6.5,1 L6.5,15 L2.5,15 z M9.5,1 L13.5,1 L13.5,15 L9.5,15 z" />
    </svg>
  );
};

export default PauseIcon;
