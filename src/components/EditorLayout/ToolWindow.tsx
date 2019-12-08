import * as React from "react";

import styled from "styled-components";

const ToolWindowDiv = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
  padding: 5px;
  overflow: auto;
`;

const ToolWindow: React.FC = ({ children }) => {
  return (
    <ToolWindowDiv>{children}</ToolWindowDiv>
  )
}

export default ToolWindow;

