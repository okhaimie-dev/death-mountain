#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct AdventurerPacked {
    #[key]
    pub adventurer_id: u64,
    pub packed: felt252,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct AdventurerSeed {
    #[key]
    pub adventurer_id: u64,
    #[key]
    pub action_count: u16,
    pub seed: felt252,
}

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct BagPacked {
    #[key]
    pub adventurer_id: u64,
    pub packed: felt252,
}

#[derive(Introspect, Drop, Serde)]
#[dojo::model]
pub struct AdventurerObituary {
    #[key]
    pub adventurer_id: u64,
    pub obituary: ByteArray,
}