import {
  BEAST_NAMES,
  BEAST_SPECIAL_NAME_LEVEL_UNLOCK,
  BEAST_NAME_PREFIXES,
  BEAST_NAME_SUFFIXES
} from "../constants/beast";

/**
 * Determines the beast type based on its ID
 * @param id Beast ID
 * @returns The type of the beast (Magic_or_Cloth, Blade_or_Hide, or Bludgeon_or_Metal)
 */
export function getBeastType(id: number): string {
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
export function getBeastTier(id: number): number {
  if (isT1(id)) return 1;
  if (isT2(id)) return 2;
  if (isT3(id)) return 3;
  if (isT4(id)) return 4;
  return 5;
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
 * Gets the name of a beast based on its ID and special attributes
 * @param id Beast ID (1-75)
 * @param level Beast level
 * @param special2 Special prefix index
 * @param special3 Special suffix index
 * @returns The name of the beast, including special prefix/suffix if applicable
 */
export function getBeastName(id: number, level: number, special2: number, special3: number): string {
  const baseName = BEAST_NAMES[id];
  // Get special name components if level requirement is met
  const specialPrefix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_PREFIXES[special2] : undefined;
  const specialSuffix = level >= BEAST_SPECIAL_NAME_LEVEL_UNLOCK ? BEAST_NAME_SUFFIXES[special3] : undefined;

  if (specialPrefix && specialSuffix) {
    return `${specialPrefix} ${baseName} ${specialSuffix}`;
  } else if (specialPrefix) {
    return `${specialPrefix} ${baseName}`;
  } else if (specialSuffix) {
    return `${baseName} ${specialSuffix}`;
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