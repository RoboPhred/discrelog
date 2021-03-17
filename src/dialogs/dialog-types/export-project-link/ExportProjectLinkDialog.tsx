import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { useAction } from "@/hooks/useAction";

import { acceptDialog } from "@/actions/dialog-response-accept";

import { dialogDataSelector } from "@/services/dialog/selectors/dialog";

import Button from "@/components/Button";
import Dialog from "@/components/Dialog";

import styles from "./ExportProjectLinkDialog.module.css";

import { ExportProjectLinkDialogData } from "./types";

const ExportProjectLinkDialog: React.FC = () => {
  const onCloseDialog = useAction(acceptDialog);
  const dialogData: ExportProjectLinkDialogData | null = useSelector(
    dialogDataSelector
  ) as any;

  const projectLink = dialogData?.projectLink;

  const onCopy = React.useCallback(() => {
    if (!projectLink) {
      return;
    }
    // TODO: Show link in dialog on failure
    navigator.clipboard.writeText(projectLink).catch(() => {
      /* do nothing */
    });
  }, [projectLink]);

  if (!projectLink) {
    return null;
  }

  const dialogFooter = <Button onClick={onCopy}>Copy to Clipboard</Button>;

  return (
    <Dialog
      isOpen={true}
      title="Export Project Link"
      cancelText="Close"
      onCancel={onCloseDialog}
      footer={dialogFooter}
    >
      <div className={styles["export-link-dialog-link-container"]}>
        <code className={styles["export-link-dialog-link"]}>{projectLink}</code>
      </div>
    </Dialog>
  );
};

export default ExportProjectLinkDialog;
