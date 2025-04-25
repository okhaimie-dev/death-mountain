import { ClauseBuilder, ParsedEntity, ToriiQueryBuilder, UnionOfModelData } from '@dojoengine/sdk';
import { SchemaType } from '../generated/models.gen.ts';

export interface Item {
  id: number;
  xp: number;
}

export interface Adventurer {
  health: number;
  xp: number;
  gold: number;
  beast_health: number;
  stat_upgrades_available: number;
  stats: {
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    luck: number;
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
  action_count: number;
  item_specials_seed: number;
}

export interface AdventurerPacked {
  health: number;
  xp: number;
  gold: number;
  beast_health: number;
  stat_upgrades_available: number;
  stats: {
    strength: number;
    dexterity: number;
    vitality: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    luck: number;
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
  action_count: number;
  item_specials_seed: number;
}

export interface Beast {
  id: number;
  name: string;
  health: number;
  level: number;
  type: string;
  tier: string;
  specialPrefix?: string;
  specialSuffix?: string;
  goldReward: number;
  xpReward: number;
}

export interface Stats {
  strength: number;
  dexterity: number;
  vitality: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  luck: number;
}

export interface ItemPurchase {
  item_id: number;
  equip: boolean;
}

export interface AdventurerEntropy {
  id: string;
  market_seed: bigint;
  beast_seed: bigint;
}

export interface GameEvent {
  adventurer_id: string;
  event_type: string;
  event_data: string;
}

export interface Metadata {
  player_name: string;
  settings_id: number;
  minted_by: string;
  expires_at: number;
  available_at: number;
}

export type GameSchemaType = SchemaType;
export type GameSchemaModels = GameSchemaType['lootsurvivor'];
export type GameComponentModels = GameSchemaType['tournaments'];
export type GameSchemaModelNames = keyof GameSchemaModels;
export type GameComponentModelNames = keyof GameComponentModels;
export type GameModelType = UnionOfModelData<GameSchemaType>;
export type GameEntity = ParsedEntity<GameSchemaType>;

export class GameQueryBuilder extends ToriiQueryBuilder<GameSchemaType> { }
export class GameClauseBuilder extends ClauseBuilder<GameSchemaType> { }

export const getEntityModel = <M extends GameModelType>(entity: GameEntity, modelName: GameSchemaModelNames | GameComponentModelNames): M => (
  entity?.models[`${import.meta.env.VITE_PUBLIC_NAMESPACE}`]?.[modelName] as M
)