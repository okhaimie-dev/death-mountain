import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, CairoOption, CairoOptionVariant, BigNumberish } from 'starknet';

// Type definition for `lootsurvivor::models::game::AdventurerEntropy` struct
export interface AdventurerEntropy {
	adventurer_id: BigNumberish;
	market_seed: BigNumberish;
	beast_seed: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::AdventurerEntropyValue` struct
export interface AdventurerEntropyValue {
	market_seed: BigNumberish;
	beast_seed: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::AdventurerPacked` struct
export interface AdventurerPacked {
	adventurer_id: BigNumberish;
	packed: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::AdventurerPackedValue` struct
export interface AdventurerPackedValue {
	packed: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::BagPacked` struct
export interface BagPacked {
	adventurer_id: BigNumberish;
	packed: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::BagPackedValue` struct
export interface BagPackedValue {
	packed: BigNumberish;
}

// Type definition for `tournaments::components::models::game::GameCounter` struct
export interface GameCounter {
	key: BigNumberish;
	count: BigNumberish;
}

// Type definition for `tournaments::components::models::game::GameCounterValue` struct
export interface GameCounterValue {
	count: BigNumberish;
}

// Type definition for `tournaments::components::models::game::GameMetadata` struct
export interface GameMetadata {
	contract_address: string;
	creator_address: string;
	name: BigNumberish;
	description: string;
	developer: BigNumberish;
	publisher: BigNumberish;
	genre: BigNumberish;
	image: string;
}

// Type definition for `tournaments::components::models::game::GameMetadataValue` struct
export interface GameMetadataValue {
	creator_address: string;
	name: BigNumberish;
	description: string;
	developer: BigNumberish;
	publisher: BigNumberish;
	genre: BigNumberish;
	image: string;
}

// Type definition for `tournaments::components::models::game::Score` struct
export interface Score {
	game_id: BigNumberish;
	score: BigNumberish;
}

// Type definition for `tournaments::components::models::game::ScoreValue` struct
export interface ScoreValue {
	score: BigNumberish;
}

// Type definition for `tournaments::components::models::game::Settings` struct
export interface Settings {
	id: BigNumberish;
	name: BigNumberish;
	value: BigNumberish;
}

// Type definition for `tournaments::components::models::game::SettingsCounter` struct
export interface SettingsCounter {
	key: BigNumberish;
	count: BigNumberish;
}

// Type definition for `tournaments::components::models::game::SettingsCounterValue` struct
export interface SettingsCounterValue {
	count: BigNumberish;
}

// Type definition for `tournaments::components::models::game::SettingsDetails` struct
export interface SettingsDetails {
	id: BigNumberish;
	name: BigNumberish;
	description: string;
	exists: boolean;
}

// Type definition for `tournaments::components::models::game::SettingsDetailsValue` struct
export interface SettingsDetailsValue {
	name: BigNumberish;
	description: string;
	exists: boolean;
}

// Type definition for `tournaments::components::models::game::SettingsValue` struct
export interface SettingsValue {
	value: BigNumberish;
}

// Type definition for `tournaments::components::models::game::TokenMetadata` struct
export interface TokenMetadata {
	token_id: BigNumberish;
	minted_by: string;
	player_name: BigNumberish;
	settings_id: BigNumberish;
	lifecycle: Lifecycle;
}

// Type definition for `tournaments::components::models::game::TokenMetadataValue` struct
export interface TokenMetadataValue {
	minted_by: string;
	player_name: BigNumberish;
	settings_id: BigNumberish;
	lifecycle: Lifecycle;
}

// Type definition for `tournaments::components::models::lifecycle::Lifecycle` struct
export interface Lifecycle {
	mint: BigNumberish;
	start: CairoOption<BigNumberish>;
	end: CairoOption<BigNumberish>;
}

// Type definition for `lootsurvivor::models::adventurer::stats::Stats` struct
export interface Stats {
	strength: BigNumberish;
	dexterity: BigNumberish;
	vitality: BigNumberish;
	intelligence: BigNumberish;
	wisdom: BigNumberish;
	charisma: BigNumberish;
	luck: BigNumberish;
}

// Type definition for `lootsurvivor::models::game::AttackDetails` struct
export interface AttackDetails {
	damage: BigNumberish;
	location: SlotEnum;
	critical_hit: boolean;
}

// Type definition for `lootsurvivor::models::game::DropEvent` struct
export interface DropEvent {
	items: Array<BigNumberish>;
}

// Type definition for `lootsurvivor::models::game::EquipEvent` struct
export interface EquipEvent {
	items: Array<BigNumberish>;
	beast_attack: AttackDetails;
}

// Type definition for `lootsurvivor::models::game::ExploreBeastEvent` struct
export interface ExploreBeastEvent {
	beast_seed: BigNumberish;
	ambush: AttackDetails;
}

// Type definition for `lootsurvivor::models::game::ExploreObstacleEvent` struct
export interface ExploreObstacleEvent {
	obstacle_id: BigNumberish;
	dodged: boolean;
	damage: BigNumberish;
	location: SlotEnum;
	critical_hit: boolean;
}

// Type definition for `lootsurvivor::models::game::FleeEvent` struct
export interface FleeEvent {
	success: boolean;
	beast_attack: AttackDetails;
}

// Type definition for `lootsurvivor::models::game::GameEvent` struct
export interface GameEvent {
	adventurer_id: BigNumberish;
	action_count: BigNumberish;
	details: GameEventDetailsEnum;
}

// Type definition for `lootsurvivor::models::game::GameEventValue` struct
export interface GameEventValue {
	details: GameEventDetailsEnum;
}

// Type definition for `lootsurvivor::models::game::LevelUpEvent` struct
export interface LevelUpEvent {
	market_seed: BigNumberish;
	potions: BigNumberish;
	attributes: Stats;
	items: Array<ItemPurchase>;
}

// Type definition for `lootsurvivor::models::market::ItemPurchase` struct
export interface ItemPurchase {
	item_id: BigNumberish;
	equip: boolean;
}

// Type definition for `lootsurvivor::constants::combat::CombatEnums::Slot` enum
export const slot = [
	'None',
	'Weapon',
	'Chest',
	'Head',
	'Waist',
	'Foot',
	'Hand',
	'Neck',
	'Ring',
] as const;
export type Slot = { [key in typeof slot[number]]: string };
export type SlotEnum = CairoCustomEnum;

// Type definition for `lootsurvivor::constants::discovery::DiscoveryEnums::DiscoveryType` enum
export const discoveryType = [
	'Gold',
	'Health',
	'Loot',
] as const;
export type DiscoveryType = { [key in typeof discoveryType[number]]: string };
export type DiscoveryTypeEnum = CairoCustomEnum;

// Type definition for `lootsurvivor::models::game::ExploreEvent` enum
export const exploreEvent = [
	'Beast',
	'Obstacle',
	'Discovery',
] as const;
export type ExploreEvent = { 
	Beast: ExploreBeastEvent,
	Obstacle: ExploreObstacleEvent,
	Discovery: DiscoveryTypeEnum,
};
export type ExploreEventEnum = CairoCustomEnum;

// Type definition for `lootsurvivor::models::game::GameEventDetails` enum
export const gameEventDetails = [
	'explore',
	'attack',
	'flee',
	'equip',
	'drop',
	'level_up',
] as const;
export type GameEventDetails = { 
	explore: Array<ExploreEventEnum>,
	attack: Array<AttackDetails>,
	flee: Array<FleeEvent>,
	equip: EquipEvent,
	drop: DropEvent,
	level_up: LevelUpEvent,
};
export type GameEventDetailsEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	lootsurvivor: {
		AdventurerEntropy: AdventurerEntropy,
		AdventurerEntropyValue: AdventurerEntropyValue,
		AdventurerPacked: AdventurerPacked,
		AdventurerPackedValue: AdventurerPackedValue,
		BagPacked: BagPacked,
		BagPackedValue: BagPackedValue,
	},
	tournaments: {
		GameCounter: GameCounter,
		GameCounterValue: GameCounterValue,
		GameMetadata: GameMetadata,
		GameMetadataValue: GameMetadataValue,
		Score: Score,
		ScoreValue: ScoreValue,
		Settings: Settings,
		SettingsCounter: SettingsCounter,
		SettingsCounterValue: SettingsCounterValue,
		SettingsDetails: SettingsDetails,
		SettingsDetailsValue: SettingsDetailsValue,
		SettingsValue: SettingsValue,
		TokenMetadata: TokenMetadata,
		TokenMetadataValue: TokenMetadataValue,
		Lifecycle: Lifecycle,
		Stats: Stats,
		AttackDetails: AttackDetails,
		DropEvent: DropEvent,
		EquipEvent: EquipEvent,
		ExploreBeastEvent: ExploreBeastEvent,
		ExploreObstacleEvent: ExploreObstacleEvent,
		FleeEvent: FleeEvent,
		GameEvent: GameEvent,
		GameEventValue: GameEventValue,
		LevelUpEvent: LevelUpEvent,
		ItemPurchase: ItemPurchase,
	},
}
export const schema: SchemaType = {
	lootsurvivor: {
		AdventurerEntropy: {
			adventurer_id: 0,
			market_seed: 0,
			beast_seed: 0,
		},
		AdventurerEntropyValue: {
			market_seed: 0,
			beast_seed: 0,
		},
		AdventurerPacked: {
			adventurer_id: 0,
			packed: 0,
		},
		AdventurerPackedValue: {
			packed: 0,
		},
		BagPacked: {
			adventurer_id: 0,
			packed: 0,
		},
		BagPackedValue: {
			packed: 0,
		},
		GameCounter: {
			key: 0,
			count: 0,
		},
		GameCounterValue: {
			count: 0,
		},
		GameMetadata: {
			contract_address: "",
			creator_address: "",
			name: 0,
		description: "",
			developer: 0,
			publisher: 0,
			genre: 0,
		image: "",
		},
		GameMetadataValue: {
			creator_address: "",
			name: 0,
		description: "",
			developer: 0,
			publisher: 0,
			genre: 0,
		image: "",
		},
		Score: {
			game_id: 0,
			score: 0,
		},
		ScoreValue: {
			score: 0,
		},
		Settings: {
			id: 0,
			name: 0,
			value: 0,
		},
		SettingsCounter: {
			key: 0,
			count: 0,
		},
		SettingsCounterValue: {
			count: 0,
		},
		SettingsDetails: {
			id: 0,
			name: 0,
		description: "",
			exists: false,
		},
		SettingsDetailsValue: {
			name: 0,
		description: "",
			exists: false,
		},
		SettingsValue: {
			value: 0,
		},
		TokenMetadata: {
			token_id: 0,
			minted_by: "",
			player_name: 0,
			settings_id: 0,
		lifecycle: { mint: 0, start: new CairoOption(CairoOptionVariant.None), end: new CairoOption(CairoOptionVariant.None), },
		},
		TokenMetadataValue: {
			minted_by: "",
			player_name: 0,
			settings_id: 0,
		lifecycle: { mint: 0, start: new CairoOption(CairoOptionVariant.None), end: new CairoOption(CairoOptionVariant.None), },
		},
		Lifecycle: {
			mint: 0,
		start: new CairoOption(CairoOptionVariant.None),
		end: new CairoOption(CairoOptionVariant.None),
		},
		Stats: {
			strength: 0,
			dexterity: 0,
			vitality: 0,
			intelligence: 0,
			wisdom: 0,
			charisma: 0,
			luck: 0,
		},
		AttackDetails: {
			damage: 0,
		location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }),
			critical_hit: false,
		},
		DropEvent: {
			items: [0],
		},
		EquipEvent: {
			items: [0],
		beast_attack: { damage: 0, location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }), critical_hit: false, },
		},
		ExploreBeastEvent: {
			beast_seed: 0,
		ambush: { damage: 0, location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }), critical_hit: false, },
		},
		ExploreObstacleEvent: {
			obstacle_id: 0,
			dodged: false,
			damage: 0,
		location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }),
			critical_hit: false,
		},
		FleeEvent: {
			success: false,
		beast_attack: { damage: 0, location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }), critical_hit: false, },
		},
		GameEvent: {
			adventurer_id: 0,
			action_count: 0,
		details: new CairoCustomEnum({ 
					explore: [new CairoCustomEnum({ 
				Beast: { beast_seed: 0, ambush: { damage: 0, location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }), critical_hit: false, }, },
				Obstacle: undefined,
				Discovery: undefined, })],
				attack: undefined,
				flee: undefined,
				equip: undefined,
				drop: undefined,
				level_up: undefined, }),
		},
		GameEventValue: {
		details: new CairoCustomEnum({ 
					explore: [new CairoCustomEnum({ 
				Beast: { beast_seed: 0, ambush: { damage: 0, location: new CairoCustomEnum({ 
					None: "",
				Weapon: undefined,
				Chest: undefined,
				Head: undefined,
				Waist: undefined,
				Foot: undefined,
				Hand: undefined,
				Neck: undefined,
				Ring: undefined, }), critical_hit: false, }, },
				Obstacle: undefined,
				Discovery: undefined, })],
				attack: undefined,
				flee: undefined,
				equip: undefined,
				drop: undefined,
				level_up: undefined, }),
		},
		LevelUpEvent: {
			market_seed: 0,
			potions: 0,
		attributes: { strength: 0, dexterity: 0, vitality: 0, intelligence: 0, wisdom: 0, charisma: 0, luck: 0, },
			items: [{ item_id: 0, equip: false, }],
		},
		ItemPurchase: {
			item_id: 0,
			equip: false,
		},
	},
};
export enum ModelsMapping {
	AdventurerEntropy = 'lootsurvivor-AdventurerEntropy',
	AdventurerEntropyValue = 'lootsurvivor-AdventurerEntropyValue',
	AdventurerPacked = 'lootsurvivor-AdventurerPacked',
	AdventurerPackedValue = 'lootsurvivor-AdventurerPackedValue',
	BagPacked = 'lootsurvivor-BagPacked',
	BagPackedValue = 'lootsurvivor-BagPackedValue',
	GameCounter = 'tournaments-GameCounter',
	GameCounterValue = 'tournaments-GameCounterValue',
	GameMetadata = 'tournaments-GameMetadata',
	GameMetadataValue = 'tournaments-GameMetadataValue',
	Score = 'tournaments-Score',
	ScoreValue = 'tournaments-ScoreValue',
	Settings = 'tournaments-Settings',
	SettingsCounter = 'tournaments-SettingsCounter',
	SettingsCounterValue = 'tournaments-SettingsCounterValue',
	SettingsDetails = 'tournaments-SettingsDetails',
	SettingsDetailsValue = 'tournaments-SettingsDetailsValue',
	SettingsValue = 'tournaments-SettingsValue',
	TokenMetadata = 'tournaments-TokenMetadata',
	TokenMetadataValue = 'tournaments-TokenMetadataValue',
	Lifecycle = 'tournaments-Lifecycle',
	Slot = 'lootsurvivor-Slot',
	DiscoveryType = 'lootsurvivor-DiscoveryType',
	Stats = 'lootsurvivor-Stats',
	AttackDetails = 'lootsurvivor-AttackDetails',
	DropEvent = 'lootsurvivor-DropEvent',
	EquipEvent = 'lootsurvivor-EquipEvent',
	ExploreBeastEvent = 'lootsurvivor-ExploreBeastEvent',
	ExploreEvent = 'lootsurvivor-ExploreEvent',
	ExploreObstacleEvent = 'lootsurvivor-ExploreObstacleEvent',
	FleeEvent = 'lootsurvivor-FleeEvent',
	GameEvent = 'lootsurvivor-GameEvent',
	GameEventDetails = 'lootsurvivor-GameEventDetails',
	GameEventValue = 'lootsurvivor-GameEventValue',
	LevelUpEvent = 'lootsurvivor-LevelUpEvent',
	ItemPurchase = 'lootsurvivor-ItemPurchase',
}