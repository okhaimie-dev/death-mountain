use lootsurvivor::models::combat::CombatSpec;

#[derive(Drop, Serde, Copy)]
pub struct BattleDetails {
    pub seed: u32,
    pub id: u8,
    pub beast_specs: CombatSpec,
    pub damage: u16,
    pub critical_hit: bool,
    pub location: u8,
}

#[derive(Drop, Serde, Copy)]
pub struct ObstacleDetails {
    pub id: u8,
    pub level: u16,
    pub damage_taken: u16,
    pub damage_location: u8,
    pub critical_hit: bool,
    pub adventurer_xp_reward: u16,
    pub item_xp_reward: u16,
}
