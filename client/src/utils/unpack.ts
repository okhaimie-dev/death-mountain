import { AdventurerPacked, BagPacked, Item } from '../types/game';

// Constants for bit manipulation
const TWO_POW_7 = BigInt(0x80);
const TWO_POW_10 = BigInt(0x400);
const TWO_POW_15 = BigInt(0x8000);
const TWO_POW_16 = BigInt(0x10000);
const TWO_POW_25 = BigInt(0x2000000);
const TWO_POW_34 = BigInt(0x400000000);
const TWO_POW_44 = BigInt(0x100000000000);
const TWO_POW_48 = BigInt(0x1000000000000);
const TWO_POW_78 = BigInt(0x4000000000000000000);
const TWO_POW_206 = BigInt("104857600000000000000000000000000000000000000000000000");
const TWO_POW_222 = BigInt("6901746346790563787434755862277025452451108972170386555162524223799296");

// Unpack an item (7 bits id, 9 bits xp)
const unpackItem = (packed: bigint): Item => {
    const id = Number(packed & BigInt(0x7F));  // 7 bits for id
    const xp = Number((packed >> BigInt(7)) & BigInt(0x1FF));  // 9 bits for xp
    return { id, xp };
};

// Unpack a bag (15 items, 16 bits each)
export const unpackBag = (packed: any): BagPacked => {
    const packedValue = BigInt(packed.value);
    const items: Item[] = [];
    
    // Unpack 15 items
    for (let i = 0; i < 15; i++) {
        const itemMask = (BigInt(0xFFFF) << BigInt(i * 16));
        const itemPacked = (packedValue & itemMask) >> BigInt(i * 16);
        items.push(unpackItem(itemPacked));
    }

    return {
        items,
        mutated: packed.mutated || false
    };
};

// Unpack game data
export const unpackGame = (packed: any) => {
    return {
        game_id: packed.game_id,
        hero_health: packed.hero_health,
        hero_xp: packed.hero_xp,
        monsters_slain: packed.monsters_slain,
        map_level: packed.map_level,
        map_depth: packed.map_depth,
        last_node_id: packed.last_node_id,
        action_count: packed.action_count,
        state: packed.state
    };
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

// Unpack adventurer data
export const unpackAdventurer = (packed: any): AdventurerPacked => {
    const value = BigInt(packed.value);
    
    return {
        health: Number(value & ((BigInt(1) << BigInt(10)) - BigInt(1))),  // 10 bits
        xp: Number((value >> BigInt(10)) & ((BigInt(1) << BigInt(15)) - BigInt(1))),  // 15 bits
        gold: Number((value >> BigInt(25)) & ((BigInt(1) << BigInt(9)) - BigInt(1))),  // 9 bits
        beast_health: Number((value >> BigInt(34)) & ((BigInt(1) << BigInt(10)) - BigInt(1))),  // 10 bits
        stat_upgrades_available: Number((value >> BigInt(44)) & ((BigInt(1) << BigInt(4)) - BigInt(1))),  // 4 bits
        stats: unpackStats((value >> BigInt(48)) & ((BigInt(1) << BigInt(30)) - BigInt(1))),  // 30 bits
        equipment: unpackEquipment((value >> BigInt(78)) & ((BigInt(1) << BigInt(128)) - BigInt(1))),  // 128 bits
        action_count: Number((value >> BigInt(206)) & ((BigInt(1) << BigInt(16)) - BigInt(1))),  // 16 bits
        item_specials_seed: Number((value >> BigInt(222)) & ((BigInt(1) << BigInt(16)) - BigInt(1)))  // 16 bits
    };
};