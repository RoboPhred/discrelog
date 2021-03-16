import * as React from "react";

import { Switch, Route } from "react-router-dom";

import ProjectEditorPage from "@/pages/ProjectEditorPage";
import ProjectImporterPage from "@/pages/ProjectImporterPage";

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={ProjectEditorPage} />
      <Route exact path="/import" component={ProjectImporterPage} />
    </Switch>
  );
};

export default Routes;
