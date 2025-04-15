#[starknet::interface]
pub trait IObstacleSystems<T> {

}

#[dojo::contract]
mod Obstacle_systems {
    use super::IObstacleSystems;

    #[abi(embed_v0)]
    impl ObstacleSystemsImpl of IObstacleSystems<ContractState> {
    }
}