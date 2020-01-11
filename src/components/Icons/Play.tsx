import * as React from "react";

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  return (
    <svg width={16} height={16} {...props}>
      <path d="M0,0 L10,8 L0,16 z" />
    </svg>
  );
};

export default PlayIcon;
