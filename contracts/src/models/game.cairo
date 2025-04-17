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
