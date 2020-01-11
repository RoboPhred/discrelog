import * as React from "react";

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width={16} height={16} {...props}>
      <path d="M0,0 L16,0 L16,16 L0,16 z" />
    </svg>
  );
};

export default StopIcon;
