use lootsurvivor::constants::combat::CombatEnums::{Slot};
use lootsurvivor::constants::discovery::DiscoveryEnums::DiscoveryType;
use lootsurvivor::models::adventurer::stats::Stats;
use lootsurvivor::models::market::ItemPurchase;

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
pub enum GameEventDetails {
    explore: Span<ExploreEvent>,
    attack: Span<AttackDetails>,
    flee: Span<FleeEvent>,
    equip: EquipEvent,
    drop: DropEvent,
    level_up: LevelUpEvent,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct AttackDetails {
    pub damage: u16,
    pub location: Slot,
    pub critical_hit: bool,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub enum ExploreEvent {
    Beast: ExploreBeastEvent,
    Obstacle: ExploreObstacleEvent,
    Discovery: DiscoveryType,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct ExploreBeastEvent {
    pub beast_seed: u64,
    pub ambush: AttackDetails,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct ExploreObstacleEvent {
    pub obstacle_id: u8,
    pub dodged: bool,
    pub damage: u16,
    pub location: Slot,
    pub critical_hit: bool,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct FleeEvent {
    pub success: bool,
    pub beast_attack: AttackDetails,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct EquipEvent {
    pub items: Span<u8>,
    pub beast_attack: AttackDetails,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct DropEvent {
    pub items: Span<u8>,
}

#[derive(Introspect, Copy, Drop, Serde)]
pub struct LevelUpEvent {
    pub market_seed: u64,
    pub potions: u8,
    pub attributes: Stats,
    pub items: Span<ItemPurchase>,
}
