import * as React from "react";

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width={16} height={16} {...props}>
      <path d="M3,0 L13,8 L3,16 z" />
    </svg>
  );
};

export default PlayIcon;
