import { importProjectLink } from "@/actions/project-import-link";
import * as React from "react";

import { useDispatch } from "react-redux";
import { RouteChildrenProps } from "react-router-dom";

const ProjectImporterPage: React.FC<RouteChildrenProps> = ({ location }) => {
  const dispatch = useDispatch();
  const [importError, setImportError] = React.useState(false);

  React.useEffect(() => {
    let searchParams: URLSearchParams;
    try {
      searchParams = new URLSearchParams(location.search);
    } catch (e) {
      setImportError(true);
      return;
    }

    const data = searchParams.get("data");
    if (!data) {
      setImportError(true);
      return;
    }

    dispatch(importProjectLink(data));

    // This is an effect, these are not dependencies.  Stop warning me about this.
    // We only want to run on page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: better styling.

  if (importError) {
    // TODO: Better error message
    return <div>Failed to import project</div>;
  }

  return <div>Importing Project...</div>;
};

export default ProjectImporterPage;
