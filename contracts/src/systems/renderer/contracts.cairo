#[starknet::interface]
pub trait IRendererSystems<T> {
    fn create_metadata(self: @T, adventurer_id: u64) -> ByteArray;
}

#[dojo::contract]
mod renderer_systems {
    use super::IRendererSystems;
    use lootsurvivor::constants::world::{DEFAULT_NS};
    use lootsurvivor::utils::renderer::renderer_utils::create_metadata;
    use lootsurvivor::models::adventurer::adventurer::Adventurer;
    use lootsurvivor::models::adventurer::bag::Bag;
    use lootsurvivor::libs::game::ImplGame;

    #[abi(embed_v0)]
    impl RendererSystemsImpl of IRendererSystems<ContractState> {
        fn create_metadata(self: @ContractState, adventurer_id: u64) -> ByteArray {
            let game_libs = ImplGame::get_libs(self.world(@DEFAULT_NS()));
            let (adventurer, bag): (Adventurer, Bag) = game_libs.load_assets(adventurer_id);
            let adventurer_name = game_libs.get_adventurer_name(adventurer_id);

            create_metadata(adventurer_id, adventurer, adventurer_name, bag)
        }
    }
}