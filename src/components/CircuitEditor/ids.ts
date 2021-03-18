export function getCircuitEditorHtmlId(editorId: string) {
  return `circuit-editor-${editorId}`;
}

export function getNodeHtmlId(editorId: string, nodeId: string) {
  return `editor-${editorId}--node-${nodeId}`;
}

export function getNodePinHtmlId(
  editorId: string,
  nodeId: string,
  pinId: string
): string {
  return `editor-${editorId}--node-${nodeId}--pin-${pinId}`;
}
