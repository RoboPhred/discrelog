import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { viewScaleSelector } from "@/services/circuit-editor-ui/selectors/view";

const GridBackground: React.FC = () => {
  const scale = useSelector(viewScaleSelector);

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M 50 0 L 0 0 0 50"
            fill="none"
            stroke="gray"
            strokeWidth={0.5 * (1 / scale)}
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};

export default GridBackground;
