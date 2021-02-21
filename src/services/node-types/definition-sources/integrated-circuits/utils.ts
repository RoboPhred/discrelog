export function circuitIdToNodeType(circuitId: string) {
  return `ic-${circuitId}`;
}

export function nodeTypeToCircuitId(nodeType: string): string | null {
  if (!nodeType.startsWith("ic-")) {
    return null;
  }
  return nodeType.substr(3);
}
