import { ItemString, ItemUtils, Tier } from './items';
import { NUM_ITEMS, NUM_ITEMS_NZ_MINUS_ONE, NUMBER_OF_ITEMS_PER_LEVEL } from '../constants/game';

export interface MarketItem {
  id: number;
  name: string;
  tier: Tier;
  type: string;
  price: number;
}

function getMarketSeedAndOffset(seed: bigint): [bigint, number] {
  const divisor = BigInt(NUM_ITEMS_NZ_MINUS_ONE);
  const newSeed = seed / divisor;
  const offset = Number(seed % divisor) + 1;
  return [newSeed, offset];
}

function getMarketSize(statUpgradesAvailable: number): number {
  if (statUpgradesAvailable > 5) {
    return NUM_ITEMS;
  }
  return statUpgradesAvailable * NUMBER_OF_ITEMS_PER_LEVEL;
}

function getId(seed: bigint): number {
  return Number(seed % BigInt(NUM_ITEMS)) + 1;
}

function createMarketItem(id: number): MarketItem {
  const tier = ItemUtils.getItemTier(id);
  return {
    id,
    name: ItemString[id] || `Unknown Item ${id}`,
    tier,
    type: ItemUtils.getItemType(id),
    price: ItemUtils.getItemPrice(tier)
  };
}

export function generateMarketItems(seed: bigint, statUpgradesAvailable: number | undefined): MarketItem[] {
  if (!statUpgradesAvailable || seed === BigInt(0)) {
    return [];
  }

  const marketSize = getMarketSize(statUpgradesAvailable);

  // If market size >= NUM_ITEMS, return all items
  if (marketSize >= NUM_ITEMS) {
    return Array.from(
      { length: NUM_ITEMS },
      (_, i) => createMarketItem(i + 1)
    );
  }

  // Generate items based on seed
  const [marketSeed, offset] = getMarketSeedAndOffset(seed);
  const items: MarketItem[] = [];

  for (let i = 0; i < marketSize; i++) {
    const itemSeed = marketSeed + BigInt(offset * i);
    const itemId = getId(itemSeed);
    items.push(createMarketItem(itemId));
  }

  return items;
} 