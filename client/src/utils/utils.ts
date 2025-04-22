export function ellipseAddress(address: string, start: number, end: number) {
  return `${address.slice(0, start)}...${address.slice(-end)}`.toUpperCase();
}