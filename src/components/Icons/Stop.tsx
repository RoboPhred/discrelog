import * as React from "react";

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width={16} height={16} {...props}>
      <path d="M1,1 L15,1 L15,15 L1,15 z" />
    </svg>
  );
};

export default StopIcon;
