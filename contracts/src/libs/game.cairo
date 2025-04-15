use dojo::world::{WorldStorage, WorldStorageTrait};

use lootsurvivor::systems::loot::contracts::{ILootSystemsDispatcher, ILootSystemsDispatcherTrait};
use lootsurvivor::constants::combat::CombatEnums::{Slot, Tier, Type};
use lootsurvivor::models::combat::{SpecialPowers};
use lootsurvivor::models::loot::{Loot};

#[derive(Copy, Drop)]
pub struct GameLibs {
    loot: ILootSystemsDispatcher,
}

#[generate_trait]
pub impl ImplGame of IGameLib {
    #[inline(always)]
    fn get_libs(world: WorldStorage) -> GameLibs {
        let (loot_systems_address, _) = world.dns(@"loot_systems").unwrap();

        GameLibs {
            loot: ILootSystemsDispatcher { contract_address: loot_systems_address },
        }
    }

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
}
