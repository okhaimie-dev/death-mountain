import { getRandomness } from "./entropy";
import { Beast, Item } from "../types/game";
import {
  BEAST_SPECIAL_NAME_LEVEL_UNLOCK,
  MAX_SPECIAL2,
  MAX_SPECIAL3,
  MAX_BEAST_ID,
  BEAST_NAME_PREFIXES,
  BEAST_NAME_SUFFIXES,
  BEAST_NAMES,
  STARTER_BEAST_HEALTH,
  MAXIMUM_HEALTH
} from "../constants/beast";
import { calculateLevel } from "./game";
import { ItemType, ItemUtils } from "./loot";

export function getBeast(beastSeed: bigint, xp: number, weapon: Item): Beast {
  if (xp <= 1) {
    return getStarterBeast(weapon.id, beastSeed);
  }

  const {
    rnd1: beastIdSeed,  // Used for beast ID (u32)
    rnd3: healthRnd,    // Used for health (u16)
    rnd4: levelRnd,     // Used for level (u16)
    rnd5: special1Rnd,  // Used for special1 (u8)
    rnd6: special2Rnd,  // Used for special2 (u8)
  } = getRandomness(xp, beastSeed);

  const adventurerLevel = BigInt(calculateLevel(xp));

  // Beast ID calculation matching Cairo's get_beast_id function
  const id = (beastIdSeed % MAX_BEAST_ID) + BigInt(1);

  // Health calculation matching Cairo's get_starting_health
  const health = getStartingHealth(adventurerLevel, healthRnd);

  // Level calculation matching Cairo's get_level
  const level = getBeastLevel(adventurerLevel, levelRnd);

  const special2 = Number(special1Rnd % MAX_SPECIAL2);
  const special3 = Number(special2Rnd % MAX_SPECIAL3);

  // Get special name components if level requirement is met
  const specialPrefix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_PREFIXES[special2] : undefined;
  const specialSuffix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_SUFFIXES[special3] : undefined;

  const type = getBeastType(id);
  const tier = getBeastTier(id);

  return {
    id: Number(id),
    health: Number(health),
    level: Number(level),
    type,
    tier,
    name: getBeastName(Number(id), specialPrefix, specialSuffix),
    specialPrefix,
    specialSuffix,
  };
}

/**
 * Calculates the starting health of a beast based on adventurer level and random value
 * @param adventurerLevel Level of the adventurer
 * @param seed Random value for health calculation
 * @returns Starting health of the beast
 */
function getStartingHealth(adventurerLevel: bigint, seed: bigint): bigint {
  // For first beast, use fixed starter health
  if (adventurerLevel <= 1) {
    return STARTER_BEAST_HEALTH;
  }

  let health = BigInt(1) + (seed % (adventurerLevel * BigInt(20)));

  if (adventurerLevel >= 50) {
    health += BigInt(500);
  } else if (adventurerLevel >= 40) {
    health += BigInt(400);
  } else if (adventurerLevel >= 30) {
    health += BigInt(200);
  } else if (adventurerLevel >= 20) {
    health += BigInt(100);
  } else {
    health += BigInt(10);
  }

  if (health > MAXIMUM_HEALTH) {
    return MAXIMUM_HEALTH;
  } else {
    return health;
  }
}

/**
 * Calculates the level of a beast based on adventurer level and random value
 * @param adventurerLevel Level of the adventurer
 * @param rnd Random value for level calculation
 * @returns Level of the beast
 */
function getBeastLevel(adventurerLevel: bigint, seed: bigint): bigint {
  let level = BigInt(1) + (seed % (adventurerLevel * BigInt(3)));

  if (adventurerLevel >= 50) {
    level += BigInt(80);
  } else if (adventurerLevel >= 40) {
    level += BigInt(40);
  } else if (adventurerLevel >= 30) {
    level += BigInt(20);
  } else if (adventurerLevel >= 20) {
    level += BigInt(10);
  }

  return level;
}

/**
 * Calculates the gold reward for defeating a beast
 * @param tier Beast tier (T1-T5)
 * @param level Beast level
 * @returns Gold reward amount
 */
export function getGoldReward(beast_tier: number, beast_level: number, ring: Item): number {
  let base_reward = Math.floor(((6 - beast_tier) * beast_level) / 2);

  if (ring && ItemUtils.getItemName(ring.id) === "GoldRing") {
    base_reward += Math.floor(
      (base_reward * Math.floor(Math.sqrt(ring.xp!)) * 3) / 100
    );
  }

  return base_reward;
}

/**
 * Calculates the XP reward for defeating a beast
 * @param level Beast level
 * @param adventurerLevel Adventurer's level
 * @returns XP reward amount
 */
function getXpReward(level: bigint, tier: bigint, adventurerLevel: number): bigint {
  let xp = ((BigInt(6) - tier) * level) / BigInt(2);

  let adusted_xp =
    (xp * BigInt(100 - Math.min(adventurerLevel * 2, 95))) / BigInt(100);

  if (adusted_xp < 4) {
    return BigInt(4);
  }

  return adusted_xp;
}

/**
 * Determines the beast type based on its ID
 * @param id Beast ID
 * @returns The type of the beast (Magic_or_Cloth, Blade_or_Hide, or Bludgeon_or_Metal)
 */
export function getBeastType(id: bigint): string {
  if (id >= 0 && id < 26) {
    return 'Magic';
  } else if (id < 51) {
    return 'Hunter';
  } else if (id < 76) {
    return 'Brute';
  } else {
    return 'None';
  }
}

/**
 * Determines the attack type based on its ID
 * @param id Attack ID
 * @returns The type of the attack (Magic, Hunter, or Brute)
 */
export function getAttackType(id: number): string {
  if (id >= 0 && id < 26) {
    return 'Magic';
  } else if (id < 51) {
    return 'Blade';
  } else if (id < 76) {
    return 'Bludgeon';
  } else {
    return 'None';
  }
}

/**
 * Determines the armor type based on its ID
 * @param id Armor ID
 * @returns The type of the armor (Cloth, Hide, or Metal)
 */
export function getArmorType(id: number): string {
  if (id >= 0 && id < 26) {
    return 'Cloth';
  } else if (id < 51) {
    return 'Hide';
  } else if (id < 76) {
    return 'Metal';
  } else {
    return 'None';
  }
}

/**
 * Determines the beast tier based on its ID
 * @param id Beast ID
 * @returns The tier of the beast (T1-T5)
 */
export function getBeastTier(id: bigint): string {
  if (isT1(id)) return '1';
  if (isT2(id)) return '2';
  if (isT3(id)) return '3';
  if (isT4(id)) return '4';
  return '5';
}

// Helper functions from beast.cairo
function isT1(id: bigint): boolean {
  return (id >= 1 && id <= 5) || (id >= 26 && id < 31) || (id >= 51 && id < 56);
}

function isT2(id: bigint): boolean {
  return (id >= 6 && id < 11) || (id >= 31 && id < 36) || (id >= 56 && id < 61);
}

function isT3(id: bigint): boolean {
  return (id >= 11 && id < 16) || (id >= 36 && id < 41) || (id >= 61 && id < 66);
}

function isT4(id: bigint): boolean {
  return (id >= 16 && id < 21) || (id >= 41 && id < 46) || (id >= 66 && id < 71);
}

/**
 * Gets the name of a beast based on its ID and special attributes
 * @param id Beast ID (1-75)
 * @param level Beast level
 * @param special2 Special prefix index
 * @param special3 Special suffix index
 * @returns The name of the beast, including special prefix/suffix if applicable
 */
export function getBeastName(id: number, prefix?: string, suffix?: string): string {
  const baseName = BEAST_NAMES[id];

  if (prefix && suffix) {
    return `${prefix} ${baseName} ${suffix}`;
  } else if (prefix) {
    return `${prefix} ${baseName}`;
  } else if (suffix) {
    return `${baseName} ${suffix}`;
  }

  return baseName;
}

export const getBeastImage = (name: string) => {
  try {
    return new URL(`../assets/beasts/${name.replace(" ", "_").toLowerCase()}.png`, import.meta.url).href
  } catch (ex) {
    return ""
  }
}

export const getTierGlowColor = (tier: string): string => {
  switch (tier) {
    case '1':
      return 'rgba(255, 0, 0, 0.5)'; // Red glow for T1
    case '2':
      return 'rgba(255, 165, 0, 0.5)'; // Orange glow for T2
    case '3':
      return 'rgba(255, 255, 0, 0.5)'; // Yellow glow for T3
    case '4':
      return 'rgba(0, 255, 0, 0.5)'; // Green glow for T4
    case '5':
      return 'rgba(0, 0, 255, 0.5)'; // Blue glow for T5
    default:
      return 'rgba(128, 128, 128, 0.5)'; // Default gray glow
  }
}

// Helper functions for type strengths/weaknesses
export const getTypeStrength = (type: string): string => {
  switch (type) {
    case 'Magic':
      return 'Metal';
    case 'Hunter':
      return 'Cloth';
    case 'Brute':
      return 'Hide';
    default:
      return '';
  }
};

export const getTypeWeakness = (type: string): string => {
  switch (type) {
    case 'Magic':
      return 'Blade';
    case 'Hunter':
      return 'Bludgeon';
    case 'Brute':
      return 'Magic';
    default:
      return '';
  }
};

function getStarterBeast(weaponId: number, seed: bigint): Beast {
  let weaponType = ItemUtils.getItemType(weaponId);

  let beastId = Number(seed) % 5;
  if (weaponType === ItemType.Magic) {
    beastId += 71;
  } else if (weaponType === ItemType.Blade) {
    beastId += 21;
  } else if (weaponType === ItemType.Bludgeon) {
    beastId += 46;
  }

  return {
    id: beastId,
    name: BEAST_NAMES[beastId],
    health: Number(STARTER_BEAST_HEALTH),
    level: 1,
    type: getBeastType(BigInt(beastId)),
    tier: getBeastTier(BigInt(beastId)),
  };
}