use dojo::world::{WorldStorage, WorldStorageTrait};

use lootsurvivor::constants::combat::CombatEnums::{Slot, Tier, Type};
use lootsurvivor::constants::discovery::DiscoveryEnums::{DiscoveryType};

use lootsurvivor::systems::loot::contracts::{ILootSystemsDispatcher, ILootSystemsDispatcherTrait};
use lootsurvivor::systems::renderer::contracts::{IRendererSystemsDispatcher, IRendererSystemsDispatcherTrait};
use lootsurvivor::systems::adventurer::contracts::{IAdventurerSystemsDispatcher, IAdventurerSystemsDispatcherTrait};
use lootsurvivor::systems::beast::contracts::{IBeastSystemsDispatcher, IBeastSystemsDispatcherTrait};

use lootsurvivor::models::combat::{SpecialPowers};
use lootsurvivor::models::loot::{Loot};
use lootsurvivor::models::adventurer::adventurer::{Adventurer, ImplAdventurer};
use lootsurvivor::models::adventurer::bag::Bag;
use lootsurvivor::models::adventurer::item::Item;
use lootsurvivor::models::adventurer::stats::Stats;
use lootsurvivor::models::beast::Beast;

#[derive(Copy, Drop)]
pub struct GameLibs {
    loot: ILootSystemsDispatcher,
    renderer: IRendererSystemsDispatcher,
    adventurer: IAdventurerSystemsDispatcher,
    beast: IBeastSystemsDispatcher,
}

#[generate_trait]
pub impl ImplGame of IGameLib {
    fn get_libs(world: WorldStorage) -> GameLibs {
        let (loot_systems_address, _) = world.dns(@"loot_systems").unwrap();
        let (renderer_systems_address, _) = world.dns(@"renderer_systems").unwrap();
        let (adventurer_systems_address, _) = world.dns(@"adventurer_systems").unwrap();
        let (beast_systems_address, _) = world.dns(@"beast_systems").unwrap();

        GameLibs {
            loot: ILootSystemsDispatcher { contract_address: loot_systems_address },
            renderer: IRendererSystemsDispatcher { contract_address: renderer_systems_address },
            adventurer: IAdventurerSystemsDispatcher { contract_address: adventurer_systems_address },
            beast: IBeastSystemsDispatcher { contract_address: beast_systems_address },
        }
    }

    // Randomness Functions
    fn get_randomness(self: GameLibs, adventurer_xp: u16, seed: u64) -> (u32, u32, u16, u16, u8, u8, u8, u8) {
        self.adventurer.get_randomness(adventurer_xp, seed)
    }

    fn get_battle_randomness(self: GameLibs, xp: u16, action_count: u16, seed: u64) -> (u8, u8, u8, u8) {
        self.adventurer.get_battle_randomness(xp, action_count, seed)
    }

    // Loot Functions
    fn get_item(self: GameLibs, item_id: u8) -> Loot {
        self.loot.get_item(item_id)
    }

    fn get_specials(self: GameLibs, item_id: u8, greatness: u8, seed: u16) -> SpecialPowers {
        self.loot.get_specials(item_id, greatness, seed)
    }

    fn get_suffix(self: GameLibs, item_id: u8, seed: u16) -> u8 {
        self.loot.get_suffix(item_id, seed)
    }

    fn get_tier(self: GameLibs, item_id: u8) -> Tier {
        self.loot.get_tier(item_id)
    }

    fn get_type(self: GameLibs, item_id: u8) -> Type {
        self.loot.get_type(item_id)
    }

    fn get_slot(self: GameLibs, item_id: u8) -> Slot {
        self.loot.get_slot(item_id)
    }

    fn is_starting_weapon(self: GameLibs, item_id: u8) -> bool {
        self.loot.is_starting_weapon(item_id)
    }

    // Renderer Functions
    fn create_metadata(self: GameLibs, adventurer_id: u64) -> ByteArray {
        self.renderer.create_metadata(adventurer_id)
    }

    // Adventurer Functions
    fn load_assets(self: GameLibs, adventurer_id: u64) -> (Adventurer, Bag) {
        self.adventurer.load_assets(adventurer_id)
    }

    fn get_adventurer(self: GameLibs, adventurer_id: u64) -> Adventurer {
        self.adventurer.get_adventurer(adventurer_id)
    }

    fn get_adventurer_name(self: GameLibs, adventurer_id: u64) -> felt252 {
        self.adventurer.get_adventurer_name(adventurer_id)
    }

    fn get_discovery(self: GameLibs, adventurer_level: u8, discovery_type_rnd: u8, amount_rnd1: u8, amount_rnd2: u8) -> DiscoveryType {
        self.adventurer.get_discovery(adventurer_level, discovery_type_rnd, amount_rnd1, amount_rnd2)
    }

    fn pack_adventurer(self: GameLibs, adventurer: Adventurer) -> felt252 {
        self.adventurer.pack_adventurer(adventurer)
    }

    fn generate_starting_stats(self: GameLibs, seed: u64) -> Stats {
        self.adventurer.generate_starting_stats(seed)
    }

    fn remove_stat_boosts(self: GameLibs, adventurer: Adventurer) -> Adventurer {
        self.adventurer.remove_stat_boosts(adventurer)
    }

    // Bag Functions
    fn pack_bag(self: GameLibs, bag: Bag) -> felt252 {
        self.adventurer.pack_bag(bag)
    }

    fn get_bag_item(self: GameLibs, bag: Bag, item_id: u8) -> Item {
        self.adventurer.get_bag_item(bag, item_id)
    }

    fn add_new_item_to_bag(self: GameLibs, bag: Bag, item_id: u8) -> Bag {
        self.adventurer.add_new_item_to_bag(bag, item_id)
    }

    fn add_item_to_bag(self: GameLibs, bag: Bag, item: Item) -> Bag {
        self.adventurer.add_item_to_bag(bag, item)
    }

    fn remove_item_from_bag(self: GameLibs, bag: Bag, item_id: u8) -> (Bag, Item) {
        self.adventurer.remove_item_from_bag(bag, item_id)
    }

    fn is_bag_full(self: GameLibs, bag: Bag) -> bool {
        self.adventurer.is_bag_full(bag)
    }

    fn bag_contains(self: GameLibs, bag: Bag, item_id: u8) -> (bool, Item) {
        self.adventurer.bag_contains(bag, item_id)
    }

    // Beast Functions
    fn get_starter_beast(self: GameLibs, starter_weapon_type: Type, seed: u32) -> Beast {
        self.beast.get_starter_beast(starter_weapon_type, seed)
    }

    fn get_beast(self: GameLibs, adventurer_level: u8, weapon_type: Type, seed: u32, health_rnd: u16, level_rnd: u16, special2_rnd: u8, special3_rnd: u8) -> Beast {
        self.beast.get_beast(adventurer_level, weapon_type, seed, health_rnd, level_rnd, special2_rnd, special3_rnd)
    }

    fn get_critical_hit_chance(self: GameLibs, adventurer_level: u8, is_ambush: bool) -> u8 {
        self.beast.get_critical_hit_chance(adventurer_level, is_ambush)
    }

    fn attempt_flee(self: GameLibs, adventurer_level: u8, adventurer_dexterity: u8, rnd: u8) -> bool {
        self.beast.attempt_flee(adventurer_level, adventurer_dexterity, rnd)
    }

    // Market Functions
    fn get_market(self: GameLibs, seed: u64, stat_upgrades_available: u8) -> Array<u8> {
        self.adventurer.get_market(seed, stat_upgrades_available)
    }
}
