import { BigNumberish, shortString } from "starknet";

export const stringToFelt = (v: string): BigNumberish =>
  v ? shortString.encodeShortString(v) : "0x0";

export const feltToString = (v: BigNumberish): string => {
  return BigInt(v) > 0n ? shortString.decodeShortString(bigintToHex(v)) : "";
};

export const bigintToHex = (v: BigNumberish): `0x${string}` =>
  !v ? "0x0" : `0x${BigInt(v).toString(16)}`;

export function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function ellipseAddress(address: string, start: number, end: number) {
  return `${address.slice(0, start)}...${address.slice(-end)}`.toUpperCase();
}

export const getShortNamespace = (namespace: string) => {
  let parts = namespace.split('_');
  let short = parts[0] + parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  return short;
}