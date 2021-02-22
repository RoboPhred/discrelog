import * as React from "react";

import { Switch, Route } from "react-router-dom";

import CircuitEditorPage from "@/pages/CircuitEditorPage";
import ProjectImporterPage from "@/pages/ProjectImporterPage";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={CircuitEditorPage} />
      <Route exact path="/import" component={ProjectImporterPage} />
    </Switch>
  );
};

export default Routes;
