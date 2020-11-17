import * as React from "react";
import { Dialog, Button, Intent, InputGroup, Classes } from "@blueprintjs/core";

import { useAction } from "@/hooks/useAction";
import { cancelDialog } from "@/actions/dialog-response-cancel";
import { acceptDialog } from "@/actions/dialog-response-accept";

const SaveProjectDialog: React.FC = () => {
  const onCancelDialog = useAction(cancelDialog);
  const onAcceptDialog = useAction(acceptDialog);

  const [projectName, setProjectName] = React.useState<string>("");
  const onSetProjectName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProjectName(e.target.value);
    },
    []
  );

  const onAccept = React.useCallback(() => {
    if (projectName === "") {
      return;
    }
    onAcceptDialog(projectName);
  }, [onAcceptDialog, projectName]);

  return (
    <Dialog
      isOpen={true}
      icon="saved"
      onClose={onCancelDialog}
      title="Save Project"
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
    >
      <div className={Classes.DIALOG_BODY}>
        <InputGroup
          placeholder="Project Name"
          value={projectName}
          onChange={onSetProjectName}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onCancelDialog}>Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            disabled={projectName === ""}
            onClick={onAccept}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveProjectDialog;
