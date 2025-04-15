use lootsurvivor::models::adventurer::adventurer::Adventurer;
use lootsurvivor::models::adventurer::bag::Bag;

#[starknet::interface]
pub trait IRendererSystems<T> {
    fn create_metadata(self: @T, adventurer_id: u64, adventurer: Adventurer, adventurer_name: felt252, bag: Bag) -> ByteArray;
}

#[dojo::contract]
mod renderer_systems {
    use super::IRendererSystems;
    use lootsurvivor::utils::renderer::renderer_utils::create_metadata;
    use lootsurvivor::models::adventurer::adventurer::Adventurer;
    use lootsurvivor::models::adventurer::bag::Bag;

    #[abi(embed_v0)]
    impl RendererSystemsImpl of IRendererSystems<ContractState> {
        fn create_metadata(self: @ContractState, adventurer_id: u64, adventurer: Adventurer, adventurer_name: felt252, bag: Bag) -> ByteArray {
            create_metadata(adventurer_id, adventurer, adventurer_name, bag)
        }
    }
}