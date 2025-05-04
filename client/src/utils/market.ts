import { ItemUtils, Tier } from './loot';
import { NUM_ITEMS, NUM_ITEMS_NZ_MINUS_ONE, NUMBER_OF_ITEMS_PER_LEVEL } from '../constants/game';

export interface MarketItem {
  id: number;
  name: string;
  tier: Tier;
  type: string;
  imageUrl: string;
  price: number;
}

function getMarketSeedAndOffset(seed: bigint): [bigint, number] {
  const divisor = BigInt(NUM_ITEMS_NZ_MINUS_ONE);
  const newSeed = seed / divisor;
  const offset = Number(seed % divisor) + 1;
  return [newSeed, offset];
}

function getId(seed: bigint): number {
  return Number(seed % BigInt(NUM_ITEMS)) + 1;
}

function createMarketItem(id: number, charisma: number): MarketItem {
  const tier = ItemUtils.getItemTier(id);
  const price = ItemUtils.getItemPrice(tier, charisma);
  const name = ItemUtils.getItemName(id);
  const type = ItemUtils.getItemType(id);
  const imageUrl = ItemUtils.getItemImage(name);

  return {
    id,
    name,
    tier,
    type,
    imageUrl,
    price
  };
}

export function generateMarketItems(seed: bigint, charisma: number): MarketItem[] {
  const marketSize = NUMBER_OF_ITEMS_PER_LEVEL;

  // Generate items based on seed
  const [marketSeed, offset] = getMarketSeedAndOffset(seed);
  const items: MarketItem[] = [];

  for (let i = 0; i < marketSize; i++) {
    const itemSeed = marketSeed + BigInt(offset * i);
    const itemId = getId(itemSeed);
    items.push(createMarketItem(itemId, charisma));
  }

  return items;
}

export function potionPrice(level: number, charisma: number): number {
  return Math.max(1, level - (charisma * 2));
}