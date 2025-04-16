use lootsurvivor::models::adventurer::bag::Bag;
use lootsurvivor::models::adventurer::item::Item;
use lootsurvivor::models::adventurer::adventurer::Adventurer;
use lootsurvivor::constants::discovery::DiscoveryEnums::DiscoveryType;

#[starknet::interface]
pub trait IAdventurerSystems<T> {
    fn load_assets(self: @T, adventurer_id: u64) -> (Adventurer, Bag);
    fn get_adventurer(self: @T, adventurer_id: u64) -> Adventurer;
    fn get_bag(self: @T, adventurer_id: u64) -> Bag;
    fn get_adventurer_name(self: @T, adventurer_id: u64) -> felt252;
    fn remove_stat_boosts(self: @T, adventurer: Adventurer) -> Adventurer;
    fn pack_adventurer(self: @T, adventurer: Adventurer) -> felt252;
    fn get_discovery(self: @T, adventurer_level: u8, discovery_type_rnd: u8, amount_rnd1: u8, amount_rnd2: u8) -> DiscoveryType;
    fn pack_bag(self: @T, bag: Bag) -> felt252;
    fn unpack_bag(self: @T, packed_bag: felt252) -> Bag;
    fn get_bag_item(self: @T, bag: Bag, item_id: u8) -> Item;
    fn add_item_to_bag(self: @T, bag: Bag, item: Item) -> Bag;
    fn remove_item_from_bag(self: @T, bag: Bag, item_id: u8) -> (Bag, Item);
    fn add_new_item_to_bag(self: @T, bag: Bag, item_id: u8) -> Bag;
    fn is_bag_full(self: @T, bag: Bag) -> bool;
    fn bag_contains(self: @T, bag: Bag, item_id: u8) -> (bool, Item);
    fn get_bag_jewelry(self: @T, bag: Bag) -> Array<Item>;
    fn bag_has_specials(self: @T, bag: Bag) -> bool;
}

#[dojo::contract]
mod adventurer_systems {
    use super::IAdventurerSystems;
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;

    use tournaments::components::models::game::TokenMetadata;
    use lootsurvivor::models::game::{AdventurerPacked, BagPacked};
    use lootsurvivor::models::adventurer::bag::{Bag, ImplBag};
    use lootsurvivor::models::adventurer::adventurer::{Adventurer, ImplAdventurer};
    use lootsurvivor::models::adventurer::item::Item;
    use lootsurvivor::models::adventurer::stats::{Stats, ImplStats};
    use lootsurvivor::models::adventurer::equipment::IEquipment;
    
    use lootsurvivor::constants::world::{DEFAULT_NS};
    use lootsurvivor::constants::discovery::DiscoveryEnums::{DiscoveryType};

    #[abi(embed_v0)]
    impl AdventurerSystemsImpl of IAdventurerSystems<ContractState> {
        fn load_assets(self: @ContractState, adventurer_id: u64) -> (Adventurer, Bag) {
            let world: WorldStorage = self.world(@DEFAULT_NS());
            let mut adventurer = _load_adventurer(world, adventurer_id);
            
            if adventurer.equipment.has_specials() {
                let item_stat_boosts = _get_stat_boosts(adventurer);
                adventurer.stats.apply_stats(item_stat_boosts);
            }

            let bag = _load_bag(world, adventurer_id);
            adventurer.set_luck(bag);

            (adventurer, bag)
        }

        fn get_adventurer(self: @ContractState, adventurer_id: u64) -> Adventurer {
            _load_adventurer(self.world(@DEFAULT_NS()), adventurer_id)
        }

        fn get_bag(self: @ContractState, adventurer_id: u64) -> Bag {
            _load_bag(self.world(@DEFAULT_NS()), adventurer_id)
        }
        
        fn get_adventurer_name(self: @ContractState, adventurer_id: u64) -> felt252 {
            let world: WorldStorage = self.world(@DEFAULT_NS());
            let token_metadata: TokenMetadata = world.read_model(adventurer_id);
            token_metadata.player_name
        }

        fn remove_stat_boosts(self: @ContractState, mut adventurer: Adventurer) -> Adventurer {
            if adventurer.equipment.has_specials() && adventurer.item_specials_seed != 0 {
                let item_stat_boosts = _get_stat_boosts(adventurer);
                adventurer.stats.remove_stats(item_stat_boosts);
            }
            adventurer
        }

        fn pack_adventurer(self: @ContractState, adventurer: Adventurer) -> felt252 {
            ImplAdventurer::pack(adventurer)
        }

        fn get_discovery(self: @ContractState, adventurer_level: u8, discovery_type_rnd: u8, amount_rnd1: u8, amount_rnd2: u8) -> DiscoveryType {
            ImplAdventurer::get_discovery(adventurer_level, discovery_type_rnd, amount_rnd1, amount_rnd2)
        }

        fn pack_bag(self: @ContractState, bag: Bag) -> felt252 {
            ImplBag::pack(bag)
        }

        fn unpack_bag(self: @ContractState, packed_bag: felt252) -> Bag {
            ImplBag::unpack(packed_bag)
        }

        fn get_bag_item(self: @ContractState, bag: Bag, item_id: u8) -> Item {
            ImplBag::get_item(bag, item_id)
        }

        fn add_item_to_bag(self: @ContractState, mut bag: Bag, item: Item) -> Bag {
            ImplBag::add_item(ref bag, item);
            bag
        }

        fn remove_item_from_bag(self: @ContractState, mut bag: Bag, item_id: u8) -> (Bag, Item) {
            let item = ImplBag::remove_item(ref bag, item_id);
            (bag, item)
        }

        fn add_new_item_to_bag(self: @ContractState, mut bag: Bag, item_id: u8) -> Bag {
            ImplBag::add_new_item(ref bag, item_id);
            bag
        }

        fn is_bag_full(self: @ContractState, bag: Bag) -> bool {
            ImplBag::is_full(bag)
        }

        fn bag_contains(self: @ContractState, bag: Bag, item_id: u8) -> (bool, Item) {
            ImplBag::contains(bag, item_id)
        }

        fn get_bag_jewelry(self: @ContractState, bag: Bag) -> Array<Item> {
            ImplBag::get_jewelry(bag)
        }

        fn bag_has_specials(self: @ContractState, bag: Bag) -> bool {
            ImplBag::has_specials(bag)
        }
    }

    /// @title Load Adventurer
    /// @notice Loads the adventurer and returns the adventurer.
    /// @dev This function is called when the adventurer is loaded.
    /// @param world A reference to the WorldStorage object.
    /// @param adventurer_id A felt252 representing the unique ID of the adventurer.
    /// @return The adventurer.
    fn _load_adventurer(world: WorldStorage, adventurer_id: u64) -> Adventurer {
        let mut adventurer_packed: AdventurerPacked = world.read_model(adventurer_id);
        let mut adventurer = ImplAdventurer::unpack(adventurer_packed.packed);
        adventurer
    }

    /// @title Load Bag
    /// @notice Loads the bag and returns the bag.
    /// @dev This function is called when the bag is loaded.
    /// @param self A reference to the ContractState object.
    /// @param adventurer_id A felt252 representing the unique ID of the adventurer.
    /// @return The bag.
    fn _load_bag(world: WorldStorage, adventurer_id: u64) -> Bag {
        let bag_packed: BagPacked = world.read_model(adventurer_id);
        ImplBag::unpack(bag_packed.packed)
    }

    fn _get_stat_boosts(adventurer: Adventurer) -> Stats {
        adventurer.equipment.get_stat_boosts(adventurer.item_specials_seed)
    }
}