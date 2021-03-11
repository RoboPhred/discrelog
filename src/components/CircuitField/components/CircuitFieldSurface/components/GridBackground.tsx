import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { viewScaleSelector } from "@/services/circuit-editor-ui-viewport/selectors/view";

const GridBackground: React.FC = React.memo(function GridBackground() {
  const scale = useSelector(viewScaleSelector);

  const gridSize = 50 * scale;

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid"
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

      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
});

export default GridBackground;
