import { TIER_PRICE } from '../constants/game';

// Constants from loot.cairo
export const ItemId = {
  Pendant: 1,
  Necklace: 2,
  Amulet: 3,
  SilverRing: 4,
  BronzeRing: 5,
  PlatinumRing: 6,
  TitaniumRing: 7,
  GoldRing: 8,
  GhostWand: 9,
  GraveWand: 10,
  BoneWand: 11,
  Wand: 12,
  Grimoire: 13,
  Chronicle: 14,
  Tome: 15,
  Book: 16,
  DivineRobe: 17,
  SilkRobe: 18,
  LinenRobe: 19,
  Robe: 20,
  Shirt: 21,
  Crown: 22,
  DivineHood: 23,
  SilkHood: 24,
  LinenHood: 25,
  Hood: 26,
  BrightsilkSash: 27,
  SilkSash: 28,
  WoolSash: 29,
  LinenSash: 30,
  Sash: 31,
  DivineSlippers: 32,
  SilkSlippers: 33,
  WoolShoes: 34,
  LinenShoes: 35,
  Shoes: 36,
  DivineGloves: 37,
  SilkGloves: 38,
  WoolGloves: 39,
  LinenGloves: 40,
  Gloves: 41,
  Katana: 42,
  Falchion: 43,
  Scimitar: 44,
  LongSword: 45,
  ShortSword: 46,
  DemonHusk: 47,
  DragonskinArmor: 48,
  StuddedLeatherArmor: 49,
  HardLeatherArmor: 50,
  LeatherArmor: 51,
  DemonCrown: 52,
  DragonsCrown: 53,
  WarCap: 54,
  LeatherCap: 55,
  Cap: 56,
  DemonhideBelt: 57,
  DragonskinBelt: 58,
  StuddedLeatherBelt: 59,
  HardLeatherBelt: 60,
  LeatherBelt: 61,
  DemonhideBoots: 62,
  DragonskinBoots: 63,
  StuddedLeatherBoots: 64,
  HardLeatherBoots: 65,
  LeatherBoots: 66,
  DemonsHands: 67,
  DragonskinGloves: 68,
  StuddedLeatherGloves: 69,
  HardLeatherGloves: 70,
  LeatherGloves: 71,
  Warhammer: 72,
  Quarterstaff: 73,
  Maul: 74,
  Mace: 75,
  Club: 76,
  HolyChestplate: 77,
  OrnateChestplate: 78,
  PlateMail: 79,
  ChainMail: 80,
  RingMail: 81,
  AncientHelm: 82,
  OrnateHelm: 83,
  GreatHelm: 84,
  FullHelm: 85,
  Helm: 86,
  OrnateBelt: 87,
  WarBelt: 88,
  PlatedBelt: 89,
  MeshBelt: 90,
  HeavyBelt: 91,
  HolyGreaves: 92,
  OrnateGreaves: 93,
  Greaves: 94,
  ChainBoots: 95,
  HeavyBoots: 96,
  HolyGauntlets: 97,
  OrnateGauntlets: 98,
  Gauntlets: 99,
  ChainGloves: 100,
  HeavyGloves: 101
} as const;

export const ItemString: { [key: number]: string } = {
  1: 'Pendant',
  2: 'Necklace',
  3: 'Amulet',
  4: 'Silver Ring',
  5: 'Bronze Ring',
  6: 'Platinum Ring',
  7: 'Titanium Ring',
  8: 'Gold Ring',
  9: 'Ghost Wand',
  10: 'Grave Wand',
  11: 'Bone Wand',
  12: 'Wand',
  13: 'Grimoire',
  14: 'Chronicle',
  15: 'Tome',
  16: 'Book',
  17: 'Divine Robe',
  18: 'Silk Robe',
  19: 'Linen Robe',
  20: 'Robe',
  21: 'Shirt',
  22: 'Crown',
  23: 'Divine Hood',
  24: 'Silk Hood',
  25: 'Linen Hood',
  26: 'Hood',
  27: 'Brightsilk Sash',
  28: 'Silk Sash',
  29: 'Wool Sash',
  30: 'Linen Sash',
  31: 'Sash',
  32: 'Divine Slippers',
  33: 'Silk Slippers',
  34: 'Wool Shoes',
  35: 'Linen Shoes',
  36: 'Shoes',
  37: 'Divine Gloves',
  38: 'Silk Gloves',
  39: 'Wool Gloves',
  40: 'Linen Gloves',
  41: 'Gloves',
  42: 'Katana',
  43: 'Falchion',
  44: 'Scimitar',
  45: 'Long Sword',
  46: 'Short Sword',
  47: 'Demon Husk',
  48: 'Dragonskin Armor',
  49: 'Studded Leather Armor',
  50: 'Hard Leather Armor',
  51: 'Leather Armor',
  52: 'Demon Crown',
  53: "Dragon's Crown",
  54: 'War Cap',
  55: 'Leather Cap',
  56: 'Cap',
  57: 'Demonhide Belt',
  58: 'Dragonskin Belt',
  59: 'Studded Leather Belt',
  60: 'Hard Leather Belt',
  61: 'Leather Belt',
  62: 'Demonhide Boots',
  63: 'Dragonskin Boots',
  64: 'Studded Leather Boots',
  65: 'Hard Leather Boots',
  66: 'Leather Boots',
  67: "Demon's Hands",
  68: 'Dragonskin Gloves',
  69: 'Studded Leather Gloves',
  70: 'Hard Leather Gloves',
  71: 'Leather Gloves',
  72: 'Warhammer',
  73: 'Quarterstaff',
  74: 'Maul',
  75: 'Mace',
  76: 'Club',
  77: 'Holy Chestplate',
  78: 'Ornate Chestplate',
  79: 'Plate Mail',
  80: 'Chain Mail',
  81: 'Ring Mail',
  82: 'Ancient Helm',
  83: 'Ornate Helm',
  84: 'Great Helm',
  85: 'Full Helm',
  86: 'Helm',
  87: 'Ornate Belt',
  88: 'War Belt',
  89: 'Plated Belt',
  90: 'Mesh Belt',
  91: 'Heavy Belt',
  92: 'Holy Greaves',
  93: 'Ornate Greaves',
  94: 'Greaves',
  95: 'Chain Boots',
  96: 'Heavy Boots',
  97: 'Holy Gauntlets',
  98: 'Ornate Gauntlets',
  99: 'Gauntlets',
  100: 'Chain Gloves',
  101: 'Heavy Gloves'
};

export enum ItemType {
  Magic_or_Cloth = 'Magic_or_Cloth',
  Blade_or_Hide = 'Blade_or_Hide',
  Bludgeon_or_Metal = 'Bludgeon_or_Metal',
  Ring = 'Ring',
  Necklace = 'Necklace',
  None = 'None'
}

export enum Tier {
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
  T4 = 'T4',
  T5 = 'T5',
  None = 'None'
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
    if (ItemUtils.isMagicOrCloth(id)) return ItemType.Magic_or_Cloth;
    if (ItemUtils.isBladeOrHide(id)) return ItemType.Blade_or_Hide;
    if (ItemUtils.isBludgeonOrMetal(id)) return ItemType.Bludgeon_or_Metal;
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

  getItemPrice: (tier: Tier): number => {
    switch (tier) {
      case Tier.T1: return 5 * TIER_PRICE;
      case Tier.T2: return 4 * TIER_PRICE;
      case Tier.T3: return 3 * TIER_PRICE;
      case Tier.T4: return 2 * TIER_PRICE;
      case Tier.T5: return TIER_PRICE;
      default: return 0;
    }
  }
}; 