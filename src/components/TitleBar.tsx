import * as React from "react";
import { Navbar, Alignment, Popover, Button } from "@blueprintjs/core";

import SimControls from "./SimControls";
import FileMenu from "./FileMenu";

const TitleBar: React.FC = () => {
  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>Discrelog</Navbar.Heading>
        <Navbar.Divider />
        <Popover content={<FileMenu />}>
          <Button minimal icon="document" text="File" />
        </Popover>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <SimControls />
      </Navbar.Group>
    </Navbar>
  );
};

export default TitleBar;