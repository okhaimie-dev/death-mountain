import { Adventurer, Item } from '../types/game';

// Unpack an item (7 bits id, 9 bits xp)
const unpackItem = (packed: bigint): Item => {
  const id = Number(packed & BigInt(0x7F));  // 7 bits for id
  const xp = Number((packed >> BigInt(7)) & BigInt(0x1FF));  // 9 bits for xp
  return { id, xp };
};

// Unpack stats (5 bits each)
const unpackStats = (packed: bigint) => {
  return {
    strength: Number(packed & BigInt(0x1F)),
    dexterity: Number((packed >> BigInt(5)) & BigInt(0x1F)),
    vitality: Number((packed >> BigInt(10)) & BigInt(0x1F)),
    intelligence: Number((packed >> BigInt(15)) & BigInt(0x1F)),
    wisdom: Number((packed >> BigInt(20)) & BigInt(0x1F)),
    charisma: Number((packed >> BigInt(25)) & BigInt(0x1F)),
    luck: 0 // Dynamically generated, not stored
  };
};

// Unpack equipment (8 items, 16 bits each)
const unpackEquipment = (packed: bigint) => {
  return {
    weapon: unpackItem((packed >> BigInt(0)) & BigInt(0xFFFF)),
    chest: unpackItem((packed >> BigInt(16)) & BigInt(0xFFFF)),
    head: unpackItem((packed >> BigInt(32)) & BigInt(0xFFFF)),
    waist: unpackItem((packed >> BigInt(48)) & BigInt(0xFFFF)),
    foot: unpackItem((packed >> BigInt(64)) & BigInt(0xFFFF)),
    hand: unpackItem((packed >> BigInt(80)) & BigInt(0xFFFF)),
    neck: unpackItem((packed >> BigInt(96)) & BigInt(0xFFFF)),
    ring: unpackItem((packed >> BigInt(112)) & BigInt(0xFFFF))
  };
};

// Unpack a bag (15 items, 16 bits each)
export const unpackBag = (packed: bigint): Item[] => {
  const bag: Item[] = [];

  // Unpack 15 items
  for (let i = 0; i < 15; i++) {
    const itemMask = (BigInt(0xFFFF) << BigInt(i * 16));
    const itemPacked = (packed & itemMask) >> BigInt(i * 16);
    bag.push(unpackItem(itemPacked));
  }

  return bag;
};

// Unpack adventurer data
export const unpackAdventurer = (packed: bigint): Adventurer => {
  return {
    health: Number(packed & ((BigInt(1) << BigInt(10)) - BigInt(1))),  // 10 bits
    xp: Number((packed >> BigInt(10)) & ((BigInt(1) << BigInt(15)) - BigInt(1))),  // 15 bits
    gold: Number((packed >> BigInt(25)) & ((BigInt(1) << BigInt(9)) - BigInt(1))),  // 9 bits
    beast_health: Number((packed >> BigInt(34)) & ((BigInt(1) << BigInt(10)) - BigInt(1))),  // 10 bits
    stat_upgrades_available: Number((packed >> BigInt(44)) & ((BigInt(1) << BigInt(4)) - BigInt(1))),  // 4 bits
    stats: unpackStats((packed >> BigInt(48)) & ((BigInt(1) << BigInt(30)) - BigInt(1))),  // 30 bits
    equipment: unpackEquipment((packed >> BigInt(78)) & ((BigInt(1) << BigInt(128)) - BigInt(1))),  // 128 bits
    item_specials_seed: Number((packed >> BigInt(206)) & ((BigInt(1) << BigInt(16)) - BigInt(1)))  // 16 bits
  };
};