import { TIER_PRICE } from '../constants/game';
import {
  SUFFIX_UNLOCK_GREATNESS,
  PREFIXES_UNLOCK_GREATNESS,
  ITEM_NAME_SUFFIXES,
  ITEM_NAME_PREFIXES,
  ItemId
} from '../constants/loot';

// Create a mapping from ID to name
const ItemString: { [key: number]: string } = Object.entries(ItemId).reduce((acc, [name, id]) => {
  acc[id] = name.replace(/([A-Z])/g, ' $1').trim();
  return acc;
}, {} as { [key: number]: string });

// Item types from Cairo contract
export enum ItemType {
  Magic = "Magic",
  Bludgeon = "Bludgeon",
  Blade = "Blade",
  Cloth = "Cloth",
  Hide = "Hide",
  Metal = "Metal",
  Ring = "Ring",
  Necklace = "Necklace",
  None = "None"
}

// Tier mapping from Cairo contract
export enum Tier {
  T1 = 1,
  T2 = 2,
  T3 = 3,
  T4 = 4,
  T5 = 5,
  None = 0
}

export interface Loot {
  id: number;
  tier: number;
  itemType: string;
  slot: string;
}

// Port of ItemUtils from loot.cairo
export const ItemUtils = {
  isNecklace: (id: number): boolean => id < 4,
  isRing: (id: number): boolean => id > 3 && id < 9,
  isWeapon: (id: number): boolean =>
    (id > 8 && id < 17) ||
    (id > 41 && id < 47) ||
    (id > 71 && id < 77),
  isMagicOrCloth: (id: number): boolean => id > 8 && id < 42,
  isBladeOrHide: (id: number): boolean => id > 41 && id < 72,
  isBludgeonOrMetal: (id: number): boolean => id > 71,

  getItemType: (id: number): ItemType => {
    if (ItemUtils.isNecklace(id)) return ItemType.Necklace;
    if (ItemUtils.isRing(id)) return ItemType.Ring;
    if (ItemUtils.isMagicOrCloth(id)) return ItemUtils.isWeapon(id) ? ItemType.Magic : ItemType.Cloth;
    if (ItemUtils.isBladeOrHide(id)) return ItemUtils.isWeapon(id) ? ItemType.Blade : ItemType.Hide;
    if (ItemUtils.isBludgeonOrMetal(id)) return ItemUtils.isWeapon(id) ? ItemType.Bludgeon : ItemType.Metal;
    return ItemType.None;
  },

  getItemTier: (id: number): Tier => {
    if (id <= 0) return Tier.None;

    // Jewelry items (1-8) are all T1
    if (id <= 8) return Tier.T1;

    // Magic/Cloth items (9-41)
    if (id <= 41) {
      if ([9, 13, 17, 22, 27, 32, 37].includes(id)) return Tier.T1;
      if ([10, 14, 18, 23, 28, 33, 38].includes(id)) return Tier.T2;
      if ([11, 15, 19, 24, 29, 34, 39].includes(id)) return Tier.T3;
      if ([20, 25, 30, 35, 40].includes(id)) return Tier.T4;
      return Tier.T5;
    }

    // Blade/Hide items (42-71)
    if (id <= 71) {
      if ([42, 47, 52, 57, 62, 67].includes(id)) return Tier.T1;
      if ([43, 48, 53, 58, 63, 68].includes(id)) return Tier.T2;
      if ([44, 49, 54, 59, 64, 69].includes(id)) return Tier.T3;
      if ([45, 50, 55, 60, 65, 70].includes(id)) return Tier.T4;
      return Tier.T5;
    }

    // Bludgeon/Metal items (72-101)
    if ([72, 77, 82, 87, 92, 97].includes(id)) return Tier.T1;
    if ([73, 78, 83, 88, 93, 98].includes(id)) return Tier.T2;
    if ([74, 79, 84, 89, 94, 99].includes(id)) return Tier.T3;
    if ([75, 80, 85, 90, 95, 100].includes(id)) return Tier.T4;
    return Tier.T5;
  },

  getItemBasePrice: (tier: Tier): number => {
    switch (tier) {
      case Tier.T1: return 5 * TIER_PRICE;
      case Tier.T2: return 4 * TIER_PRICE;
      case Tier.T3: return 3 * TIER_PRICE;
      case Tier.T4: return 2 * TIER_PRICE;
      case Tier.T5: return TIER_PRICE;
      default: return 0;
    }
  },

  getCharismaAdjustedItemPrice: (basePrice: number, charisma: number): number => {
    const CHARISMA_ITEM_DISCOUNT = 1; // From adventurer.cairo constants
    const MINIMUM_ITEM_PRICE = 1; // From adventurer.cairo constants

    const charismaDiscount = CHARISMA_ITEM_DISCOUNT * charisma;
    if (charismaDiscount >= basePrice) {
      return MINIMUM_ITEM_PRICE;
    }
    return basePrice - charismaDiscount;
  },

  getItemPrice: (tier: Tier, charisma: number): number => {
    const basePrice = ItemUtils.getItemBasePrice(tier);
    return ItemUtils.getCharismaAdjustedItemPrice(basePrice, charisma);
  },

  getSpecials: (id: number, greatness: number, seed: number) => {
    if (greatness < SUFFIX_UNLOCK_GREATNESS) {
      return { special1: 0, special2: 0, special3: 0 };
    } else if (greatness < PREFIXES_UNLOCK_GREATNESS) {
      return { special1: ItemUtils.getItemSuffix(id, seed), special2: 0, special3: 0 };
    } else {
      return {
        special1: ItemUtils.getItemSuffix(id, seed),
        special2: ItemUtils.getItemPrefix1(id, seed),
        special3: ItemUtils.getItemPrefix2(id, seed)
      };
    }
  },

  getItemSuffix: (id: number, seed: number) => {
    return (seed + id) % 18 + 1;
  },

  getItemPrefix1: (id: number, seed: number) => {
    return (seed + id) % 69 + 1;
  },

  getItemPrefix2: (id: number, seed: number) => {
    return (seed + id) % 18 + 1;
  },

  getWeaponSpecials: (id: number, seed: number) => {
    const special2 = 1 + (seed + id) % 69; // Prefix
    const special3 = 1 + (seed + id) % 18; // Suffix
    return {
      prefix: ITEM_NAME_PREFIXES[special2],
      suffix: ITEM_NAME_SUFFIXES[special3]
    };
  },

  getItemName: (id: number): string => {
    return ItemString[id] || "Unknown Item";
  },

  formatItemName: (name: string): string => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  },

  getItemImage: (name: string) => {
    try {
      const fileName = name.replace(/ /g, "_").toLowerCase();
      return new URL(`../assets/loot/${fileName}.png`, import.meta.url).href;
    } catch (ex) {
      return "";
    }
  },

  getMetadata: (id: number) => {
    const name = ItemUtils.getItemName(id);
    const formattedName = ItemUtils.formatItemName(name);
    const imageUrl = ItemUtils.getItemImage(name);

    return {
      name: formattedName,
      imageUrl
    };
  },

  getTierColor: (tier: Tier): string => {
    switch (tier) {
      case Tier.T1: return '#FF0000'; // Red for T1
      case Tier.T2: return '#FFA500'; // Orange for T2
      case Tier.T3: return '#FFFF00'; // Yellow for T3
      case Tier.T4: return '#00FF00'; // Green for T4
      case Tier.T5: return '#0000FF'; // Blue for T5
      default: return '#808080'; // Default gray
    }
  },

  getItemTypeIcon: (type: string): string => {
    switch (type) {
      case 'Magic': return '✨';
      case 'Bludgeon': return '🔨';
      case 'Blade': return '⚔️';
      case 'Cloth': return '🧥';
      case 'Hide': return '🦁';
      case 'Metal': return '🛡️';
      case 'Ring': return '💍';
      case 'Necklace': return '📿';
      default: return '❓';
    }
  }
}; 