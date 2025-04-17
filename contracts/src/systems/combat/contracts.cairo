#[starknet::interface]
pub trait ICombatSystems<T> {}

#[dojo::contract]
mod Combat_systems {
    use super::ICombatSystems;

    #[abi(embed_v0)]
    impl CombatSystemsImpl of ICombatSystems<ContractState> {}
}
