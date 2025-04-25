export function ellipseAddress(address: string, start: number, end: number) {
  return `${address.slice(0, start)}...${address.slice(-end)}`.toUpperCase();
}

export const getShortNamespace = (namespace: string) => {
  let parts = namespace.split('_');
  let short = parts[0] + parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  return short;
}