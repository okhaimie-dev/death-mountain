// Unpack adventurer data
export const unpackAdventurer = (packed: bigint) => {
  return {
    health: Number(packed & ((BigInt(1) << BigInt(10)) - BigInt(1))),
    xp: Number((packed >> BigInt(10)) & ((BigInt(1) << BigInt(15)) - BigInt(1))),
    gold: Number((packed >> BigInt(25)) & ((BigInt(1) << BigInt(9)) - BigInt(1))),
  };
};