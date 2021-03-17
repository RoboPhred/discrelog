import * as React from "react";

import Routes from "@/router";

import DialogManager from "../DialogManager";

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <DialogManager />
    </>
  );
};

export default App;
