use dojo::world::{WorldStorage, WorldStorageTrait};

use lootsurvivor::systems::loot::contracts::{ILootSystemsDispatcher, ILootSystemsDispatcherTrait};
use lootsurvivor::systems::market::contracts::{IMarketSystemsDispatcher, IMarketSystemsDispatcherTrait};
use lootsurvivor::constants::combat::CombatEnums::{Slot, Tier, Type};
use lootsurvivor::models::combat::{SpecialPowers};
use lootsurvivor::models::loot::{Loot};

#[derive(Copy, Drop)]
pub struct GameLibs {
    loot: ILootSystemsDispatcher,
    market: IMarketSystemsDispatcher,
}

#[generate_trait]
pub impl ImplGame of IGameLib {
    #[inline(always)]
    fn get_libs(world: WorldStorage) -> GameLibs {
        let (loot_systems_address, _) = world.dns(@"loot_systems").unwrap();
        let (market_systems_address, _) = world.dns(@"market_systems").unwrap();

        GameLibs {
            loot: ILootSystemsDispatcher { contract_address: loot_systems_address },
            market: IMarketSystemsDispatcher { contract_address: market_systems_address },
        }
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

    fn get_prefix1(self: GameLibs, item_id: u8, seed: u16) -> u8 {
        self.loot.get_prefix1(item_id, seed)
    }

    fn get_prefix2(self: GameLibs, item_id: u8, seed: u16) -> u8 {
        self.loot.get_prefix2(item_id, seed)
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

    // Market Functions
    fn get_price(self: GameLibs, tier: Tier) -> u16 {
        self.market.get_price(tier)
    }

    fn get_available_items(self: GameLibs, seed: u64, market_size: u8) -> Array<u8> {
        self.market.get_available_items(seed, market_size)
    }

    fn get_market_size(self: GameLibs, stat_upgrades_available: u8) -> u8 {
        self.market.get_market_size(stat_upgrades_available)
    }

    fn get_id(self: GameLibs, seed: u64) -> u8 {
        self.market.get_id(seed)
    }

    fn is_item_available(self: GameLibs, market_inventory: Span<u8>, item_id: u8) -> bool {
        self.market.is_item_available(market_inventory, item_id)
    }

    fn get_all_items(self: GameLibs) -> Array<u8> {
        self.market.get_all_items()
    }

    fn get_market_seed_and_offset(self: GameLibs, seed: u64) -> (u64, u8) {
        self.market.get_market_seed_and_offset(seed)
    }
}
