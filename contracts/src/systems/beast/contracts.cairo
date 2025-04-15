#[starknet::interface]
pub trait IBeastSystems<T> {

}

#[dojo::contract]
mod Beast_systems {
    use super::IBeastSystems;

    #[abi(embed_v0)]
    impl BeastSystemsImpl of IBeastSystems<ContractState> {
    }
}