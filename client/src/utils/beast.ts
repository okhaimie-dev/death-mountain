import { getRandomness } from "./entropy";
import { Beast } from "../types/game";
import {
  BEAST_SPECIAL_NAME_LEVEL_UNLOCK,
  MAX_SPECIAL2,
  MAX_SPECIAL3,
  MAX_BEAST_ID,
  GOLD_MULTIPLIER,
  GOLD_REWARD_DIVISOR,
  MINIMUM_XP_REWARD,
  BEAST_NAME_PREFIXES,
  BEAST_NAME_SUFFIXES,
  BEAST_NAMES,
  STARTER_BEAST_HEALTH,
  MAXIMUM_HEALTH
} from "../constants/beast";
import { calculateLevel } from "./game";

export function getBeast(beastSeed: bigint, xp: number): Beast {
  // Get randomness values using the same logic as Cairo implementation
  const {
    rnd1: beastIdSeed,  // Used for beast ID (u32)
    rnd3: healthRnd,    // Used for health (u16)
    rnd4: levelRnd,     // Used for level (u16)
    rnd5: special1Rnd,  // Used for special1 (u8)
    rnd6: special2Rnd,  // Used for special2 (u8)
  } = getRandomness(xp, beastSeed);

  const adventurerLevel = calculateLevel(xp);
  
  // Beast ID calculation matching Cairo's get_beast_id function
  const id = Number((BigInt(beastIdSeed) % BigInt(MAX_BEAST_ID)) + 1n);
  
  // Health calculation matching Cairo's get_starting_health
  const health = getStartingHealth(adventurerLevel, Number(healthRnd));
  
  // Level calculation matching Cairo's get_level
  const level = getBeastLevel(adventurerLevel, Number(levelRnd));
  
  const special2 = Number(BigInt(special1Rnd) % BigInt(MAX_SPECIAL2));
  const special3 = Number(BigInt(special2Rnd) % BigInt(MAX_SPECIAL3));

  // Get special name components if level requirement is met
  const specialPrefix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_PREFIXES[special2] : undefined;
  const specialSuffix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_SUFFIXES[special3] : undefined;

  const type = getBeastType(id);
  const tier = getBeastTier(id);

  // Calculate rewards
  const goldReward = getGoldReward(tier, level);
  const xpReward = getXpReward(level, adventurerLevel);

  return {
    id,
    name: getBeastName(id, level, special2, special3),
    health,
    level,
    type,
    tier,
    specialPrefix,
    specialSuffix,
    goldReward,
    xpReward
  };
}

/**
 * Calculates the starting health of a beast based on adventurer level and random value
 * @param adventurerLevel Level of the adventurer
 * @param rnd Random value for health calculation
 * @returns Starting health of the beast
 */
function getStartingHealth(adventurerLevel: number, rnd: number): number {
    // For first beast, use fixed starter health
    if (adventurerLevel === 1) {
        return STARTER_BEAST_HEALTH;
    }
    
    // Base health calculation matching Cairo's get_random_starting_health
    const baseHealth = 1 + (rnd % (adventurerLevel * 20));
    
    // Add discrete difficulty increases based on adventurer level
    let health = baseHealth;
    if (adventurerLevel >= 50) {
        health += 500;
    } else if (adventurerLevel >= 40) {
        health += 400;
    } else if (adventurerLevel >= 30) {
        health += 200;
    } else if (adventurerLevel >= 20) {
        health += 100;
    } else {
        health += 10;
    }

    // Cap health at maximum
    return Math.min(health, MAXIMUM_HEALTH);
}

/**
 * Calculates the level of a beast based on adventurer level and random value
 * @param adventurerLevel Level of the adventurer
 * @param rnd Random value for level calculation
 * @returns Level of the beast
 */
function getBeastLevel(adventurerLevel: number, rnd: number): number {
  if (adventurerLevel === 1) {
    return 1;
  }
  
  // Level calculation similar to Cairo's get_random_level
  const levelRange = Math.min(adventurerLevel + 2, 12);
  return 1 + (rnd % levelRange);
}

/**
 * Calculates the gold reward for defeating a beast
 * @param tier Beast tier (T1-T5)
 * @param level Beast level
 * @returns Gold reward amount
 */
function getGoldReward(tier: string, level: number): number {
  const multiplier = GOLD_MULTIPLIER[tier as keyof typeof GOLD_MULTIPLIER] || 1;
  return Math.floor((multiplier * level) / GOLD_REWARD_DIVISOR);
}

/**
 * Calculates the XP reward for defeating a beast
 * @param level Beast level
 * @param adventurerLevel Adventurer's level
 * @returns XP reward amount
 */
function getXpReward(level: number, adventurerLevel: number): number {
  // Base reward is the beast's level
  const baseReward = level;
  
  // If adventurer is higher level, reduce reward
  const levelDiff = Math.max(0, adventurerLevel - level);
  const reward = Math.max(1, baseReward - levelDiff);
  
  return Math.max(MINIMUM_XP_REWARD, reward);
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

export const getBeastImage = (name: string) => {
  try {
    return new URL(`../assets/beasts/${name.replace(" ", "_").toLowerCase()}.png`, import.meta.url).href
  } catch (ex) {
    return ""
  }
}