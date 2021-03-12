import * as React from "react";
import { v4 as uuidV4 } from "uuid";

import { useViewportContext } from "../../../viewport-context";

const GridBackground: React.FC = React.memo(function GridBackground() {
  const [gridId] = React.useState(`grid-${uuidV4()}`);
  const { zoomFactor } = useViewportContext();

  const gridSize = 50 * zoomFactor;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id={gridId}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="gray"
            strokeWidth={0.5}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill={`url(#${gridId})`} />
    </svg>
  );
});

export default GridBackground;
