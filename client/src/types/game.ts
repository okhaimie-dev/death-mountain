import { ClauseBuilder, ParsedEntity, ToriiQueryBuilder, UnionOfModelData } from '@dojoengine/sdk';
import { SchemaType } from '../generated/models.gen.ts';

export interface Item {
  id: number;  // 7 bits (u8)
  xp: number;  // 9 bits (u16)
}

export interface Adventurer {
  health: number;        // 10 bits
  xp: number;           // 15 bits
  gold: number;         // 9 bits
  beast_health: number;  // 10 bits
  stat_upgrades_available: number; // 4 bits
  stats: {
    strength: number;     // 5 bits
    dexterity: number;    // 5 bits
    vitality: number;     // 5 bits
    intelligence: number; // 5 bits
    wisdom: number;      // 5 bits
    charisma: number;    // 5 bits
    luck: number;        // not stored
  };
  equipment: {
    weapon: Item;
    chest: Item;
    head: Item;
    waist: Item;
    foot: Item;
    hand: Item;
    neck: Item;
    ring: Item;
  };
  action_count: number;    // 16 bits
  item_specials_seed: number; // 16 bits
}

export interface Bag {
  items: Item[];  // 15 items, 16 bits each
  mutated: boolean;
}

export interface AdventurerPacked {
  health: number;        // 10 bits
  xp: number;           // 15 bits
  gold: number;         // 9 bits
  beast_health: number;  // 10 bits
  stat_upgrades_available: number; // 4 bits
  stats: {
    strength: number;     // 5 bits
    dexterity: number;    // 5 bits
    vitality: number;     // 5 bits
    intelligence: number; // 5 bits
    wisdom: number;      // 5 bits
    charisma: number;    // 5 bits
    luck: number;        // not stored
  };
  equipment: {
    weapon: Item;
    chest: Item;
    head: Item;
    waist: Item;
    foot: Item;
    hand: Item;
    neck: Item;
    ring: Item;
  };
  action_count: number;    // 16 bits
  item_specials_seed: number; // 16 bits
}

export interface BagPacked {
  items: Item[];  // 15 items, 16 bits each
  mutated: boolean;
}

export interface AdventurerEntropy {
  id: string;
  market_seed: bigint;
  beast_seed: bigint;
}

export interface GameData {
  adventurer: AdventurerPacked | null;
  bag: BagPacked | null;
  entropy: AdventurerEntropy | null;
}

export type GameSchemaType = SchemaType;
export type GameSchemaModels = GameSchemaType['lootsurvivor'];
export type GameSchemaModelNames = keyof GameSchemaModels;
export type GameModelType = UnionOfModelData<GameSchemaType>;
export type GameEntity = ParsedEntity<GameSchemaType>;

export class GameQueryBuilder extends ToriiQueryBuilder<GameSchemaType> { }
export class GameClauseBuilder extends ClauseBuilder<GameSchemaType> { }