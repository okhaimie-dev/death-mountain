import { Beast } from '../types/game';

// Constants from beast.cairo and loot.cairo
const BEAST_SPECIAL_NAME_LEVEL_UNLOCK = 19;
const MAX_SPECIAL2 = 69;  // Max prefix index
const MAX_SPECIAL3 = 18;  // Max suffix index
const MAX_BEAST_ID = 75;

// Special name mappings from loot.cairo
const BEAST_NAME_PREFIXES: { [key: number]: string } = {
    1: "Agony",
    2: "Apocalypse",
    3: "Armageddon",
    4: "Beast",
    5: "Behemoth",
    6: "Blight",
    7: "Blood",
    8: "Bramble",
    9: "Brimstone",
    10: "Brood",
    11: "Carrion",
    12: "Cataclysm",
    13: "Chimeric",
    14: "Corpse",
    15: "Corruption",
    16: "Damnation",
    17: "Death",
    18: "Demon",
    19: "Dire",
    20: "Dragon",
    21: "Dread",
    22: "Doom",
    23: "Dusk",
    24: "Eagle",
    25: "Empyrean",
    26: "Fate",
    27: "Foe",
    28: "Gale",
    29: "Ghoul",
    30: "Gloom",
    31: "Glyph",
    32: "Golem",
    33: "Grim",
    34: "Hate",
    35: "Havoc",
    36: "Honour",
    37: "Horror",
    38: "Hypnotic",
    39: "Kraken",
    40: "Loath",
    41: "Maelstrom",
    42: "Mind",
    43: "Miracle",
    44: "Morbid",
    45: "Oblivion",
    46: "Onslaught",
    47: "Pain",
    48: "Pandemonium",
    49: "Phoenix",
    50: "Plague",
    51: "Rage",
    52: "Rapture",
    53: "Rune",
    54: "Skull",
    55: "Sol",
    56: "Soul",
    57: "Sorrow",
    58: "Spirit",
    59: "Storm",
    60: "Tempest",
    61: "Torment",
    62: "Vengeance",
    63: "Victory",
    64: "Viper",
    65: "Vortex",
    66: "Woe",
    67: "Wrath",
    68: "Lights",
    69: "Shimmering"
};

const BEAST_NAME_SUFFIXES: { [key: number]: string } = {
    1: "Bane",
    2: "Root",
    3: "Bite",
    4: "Song",
    5: "Roar",
    6: "Grasp",
    7: "Instrument",
    8: "Glow",
    9: "Bender",
    10: "Shadow",
    11: "Whisper",
    12: "Shout",
    13: "Growl",
    14: "Tear",
    15: "Peak",
    16: "Form",
    17: "Sun",
    18: "Moon"
};

// Beast name mapping from beast.cairo
const BEAST_NAMES: { [key: number]: string } = {
    // Magical Beasts
    // T1
    1: "Warlock",
    2: "Typhon",
    3: "Jiangshi",
    4: "Anansi",
    5: "Basilisk",
    // T2
    6: "Gorgon",
    7: "Kitsune",
    8: "Lich",
    9: "Chimera",
    10: "Wendigo",
    // T3
    11: "Rakshasa",
    12: "Werewolf",
    13: "Banshee",
    14: "Draugr",
    15: "Vampire",
    // T4
    16: "Goblin",
    17: "Ghoul",
    18: "Wraith",
    19: "Sprite",
    20: "Kappa",
    // T5
    21: "Fairy",
    22: "Leprechaun",
    23: "Kelpie",
    24: "Pixie",
    25: "Gnome",

    // Hunter Beasts
    // T1
    26: "Griffin",
    27: "Manticore",
    28: "Phoenix",
    29: "Dragon",
    30: "Minotaur",
    // T2
    31: "Qilin",
    32: "Ammit",
    33: "Nue",
    34: "Skinwalker",
    35: "Chupacabra",
    // T3
    36: "Weretiger",
    37: "Wyvern",
    38: "Roc",
    39: "Harpy",
    40: "Pegasus",
    // T4
    41: "Hippogriff",
    42: "Fenrir",
    43: "Jaguar",
    44: "Satori",
    45: "DireWolf",
    // T5
    46: "Bear",
    47: "Wolf",
    48: "Mantis",
    49: "Spider",
    50: "Rat",

    // Brute Beasts
    // T1
    51: "Kraken",
    52: "Colossus",
    53: "Balrog",
    54: "Leviathan",
    55: "Tarrasque",
    // T2
    56: "Titan",
    57: "Nephilim",
    58: "Behemoth",
    59: "Hydra",
    60: "Juggernaut",
    // T3
    61: "Oni",
    62: "Jotunn",
    63: "Ettin",
    64: "Cyclops",
    65: "Giant",
    // T4
    66: "NemeanLion",
    67: "Berserker",
    68: "Yeti",
    69: "Golem",
    70: "Ent",
    // T5
    71: "Troll",
    72: "Bigfoot",
    73: "Ogre",
    74: "Orc",
    75: "Skeleton"
};

interface BeastEntropy {
    id: number;
    health: number;
    level: number;
    special2: number;
    special3: number;
}

/**
 * Generates pseudo-random values from a seed using a simple hash function
 * @param seed The base seed to generate from
 * @param index The index to modify the seed (to get different values from same seed)
 * @returns A number between 0 and 2^32-1
 */
function generateValueFromSeed(seed: bigint, index: number): number {
    const hash = Number((seed + BigInt(index) * 397n) % BigInt(2**32));
    return hash;
}

/**
 * Generates all necessary random values for a beast from a beast seed
 * @param beastSeed The seed for beast generation
 * @returns Object containing all random values needed for beast generation
 */
export function generateBeastEntropy(beastSeed: bigint): BeastEntropy | null {
    if (!beastSeed) return null;
    // Generate different values using different indices
    const idRandom = generateValueFromSeed(beastSeed, 1);
    const healthRandom = generateValueFromSeed(beastSeed, 2);
    const levelRandom = generateValueFromSeed(beastSeed, 3);
    const special2Random = generateValueFromSeed(beastSeed, 4);
    const special3Random = generateValueFromSeed(beastSeed, 5);

    return {
        id: (idRandom % MAX_BEAST_ID) + 1,  // Beast ID is 1-75 (from beast.cairo)
        health: healthRandom % 65536,  // u16 max value
        level: levelRandom % 65536,    // u16 max value
        special2: special2Random % MAX_SPECIAL2,
        special3: special3Random % MAX_SPECIAL3
    };
}

/**
 * Determines the beast type based on its ID
 * @param id Beast ID
 * @returns The type of the beast (Magic_or_Cloth, Blade_or_Hide, or Bludgeon_or_Metal)
 */
export function getBeastType(id: number): string {
    if (id >= 0 && id < 26) {
        return 'Magic_or_Cloth';
    } else if (id < 51) {
        return 'Blade_or_Hide';
    } else if (id < 76) {
        return 'Bludgeon_or_Metal';
    } else {
        return 'None';
    }
}

/**
 * Determines the beast tier based on its ID
 * @param id Beast ID
 * @returns The tier of the beast (T1-T5)
 */
export function getBeastTier(id: number): string {
    if (isT1(id)) return 'T1';
    if (isT2(id)) return 'T2';
    if (isT3(id)) return 'T3';
    if (isT4(id)) return 'T4';
    return 'T5';
}

// Helper functions from beast.cairo
function isT1(id: number): boolean {
    return (id >= 1 && id <= 5) || (id >= 26 && id < 31) || (id >= 51 && id < 56);
}

function isT2(id: number): boolean {
    return (id >= 6 && id < 11) || (id >= 31 && id < 36) || (id >= 56 && id < 61);
}

function isT3(id: number): boolean {
    return (id >= 11 && id < 16) || (id >= 36 && id < 41) || (id >= 61 && id < 66);
}

function isT4(id: number): boolean {
    return (id >= 16 && id < 21) || (id >= 41 && id < 46) || (id >= 66 && id < 71);
}

/**
 * Gets the special name components for a beast if it meets the level requirement
 * @param level Beast level
 * @param special2 Special prefix index (1-69)
 * @param special3 Special suffix index (1-18)
 * @returns Object containing prefix and suffix if applicable
 */
function getBeastSpecialName(level: number, special2: number, special3: number): { prefix?: string, suffix?: string } {
    if (level < BEAST_SPECIAL_NAME_LEVEL_UNLOCK) {
        return {};
    }

    return {
        prefix: BEAST_NAME_PREFIXES[special2] || undefined,
        suffix: BEAST_NAME_SUFFIXES[special3] || undefined
    };
}

/**
 * Gets the name of a beast based on its ID and special attributes
 * @param id Beast ID (1-75)
 * @param level Beast level
 * @param special2 Special prefix index
 * @param special3 Special suffix index
 * @returns The name of the beast, including special prefix/suffix if applicable
 */
export function getBeastName(id: number, level?: number, special2?: number, special3?: number): string {
    const baseName = BEAST_NAMES[id] || "Unknown Beast";
    
    // If no special attributes provided, return base name
    if (level === undefined || special2 === undefined || special3 === undefined) {
        return baseName;
    }

    const { prefix, suffix } = getBeastSpecialName(level, special2, special3);
    
    if (prefix && suffix) {
        return `${prefix} ${baseName} ${suffix}`;
    } else if (prefix) {
        return `${prefix} ${baseName}`;
    } else if (suffix) {
        return `${baseName} ${suffix}`;
    }
    
    return baseName;
}

/**
 * Gets a description of the beast including its name, type, and tier
 * @param id Beast ID
 * @param level Beast level (optional)
 * @param special2 Special prefix index (optional)
 * @param special3 Special suffix index (optional)
 * @returns A formatted description of the beast
 */
export function getBeastDescription(id: number, level?: number, special2?: number, special3?: number): string {
    const name = getBeastName(id, level, special2, special3);
    const type = getBeastType(id);
    const tier = getBeastTier(id);
    return `${tier} ${name} (${type})`;
}