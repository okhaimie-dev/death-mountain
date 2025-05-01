use lootsurvivor::constants::combat::CombatEnums::{Slot};
use lootsurvivor::constants::discovery::DiscoveryEnums::DiscoveryType;
use lootsurvivor::models::adventurer::stats::Stats;
use lootsurvivor::models::market::ItemPurchase;

// ------------------------------------------ //
// ------------ Models ---------------------- //
// ------------------------------------------ //
#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct AdventurerPacked {
    #[key]
    pub adventurer_id: u64,
    pub packed: felt252,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct BagPacked {
    #[key]
    pub adventurer_id: u64,
    pub packed: felt252,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct AdventurerEntropy {
    #[key]
    pub adventurer_id: u64,
    pub market_seed: u64,
    pub beast_seed: u64,
}

// ------------------------------------------ //
// ------------ Events ---------------------- //
// ------------------------------------------ //
#[derive(Introspect, Copy, Drop, Serde)]
#[dojo::event]
pub struct GameEvent {
    #[key]
    pub adventurer_id: u64,
    #[key]
    pub action_count: u16,
    pub details: GameEventDetails,
}

#[derive(Introspect, Copy, Drop, Serde)]
#[dojo::event]
pub struct BattleEvent {
    #[key]
    pub adventurer_id: u64,
    #[key]
    pub action_count: u16,
    pub adventurer_xp: u16,
    pub details: BattleEventDetails,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub enum GameEventDetails {
    discovery: DiscoveryEvent,
    obstacle: ObstacleEvent,
    defeated_beast: DefeatedBeastEvent,
    fled_beast: FledBeastEvent,
    stat_upgrade: StatUpgradeEvent,
    market: MarketEvent,
    equip: ItemEvent,
    drop: ItemEvent,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct DiscoveryEvent {
    pub discovery_type: DiscoveryType,
    pub xp_reward: u16,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct ObstacleEvent {
    pub obstacle_id: u8,
    pub dodged: bool,
    pub damage: u16,
    pub location: Slot,
    pub critical_hit: bool,
    pub xp_reward: u16,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct DefeatedBeastEvent {
    pub beast_id: u8,
    pub gold_reward: u16,
    pub xp_reward: u16,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct FledBeastEvent {
    pub beast_id: u8,
    pub xp_reward: u16,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct StatUpgradeEvent {
    pub stats: Stats,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct MarketEvent {
    pub potions: u8,
    pub items_purchased: Span<ItemPurchase>,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct ItemEvent {
    pub items: Span<u8>,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub enum BattleEventDetails {
    ambush: AttackEvent,
    flee: bool,
    attack: AttackEvent,
    beast_attack: AttackEvent,
    equip: ItemEvent,
    fled_beast: FledBeastEvent,
    defeated_beast: DefeatedBeastEvent,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct AttackEvent {
    pub damage: u16,
    pub location: Slot,
    pub critical_hit: bool,
}
