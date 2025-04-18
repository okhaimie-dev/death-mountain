use dojo::world::{WorldStorage, WorldStorageTrait};

use lootsurvivor::systems::adventurer::contracts::{IAdventurerSystemsDispatcher};
use lootsurvivor::systems::beast::contracts::{IBeastSystemsDispatcher};
use lootsurvivor::systems::loot::contracts::{ILootSystemsDispatcher};
use lootsurvivor::systems::renderer::contracts::{IRendererSystemsDispatcher};

#[derive(Copy, Drop)]
pub struct GameLibs {
    pub loot: ILootSystemsDispatcher,
    pub renderer: IRendererSystemsDispatcher,
    pub adventurer: IAdventurerSystemsDispatcher,
    pub beast: IBeastSystemsDispatcher,
}

#[generate_trait]
pub impl ImplGameLibs of IGameLib {
    fn new(world: WorldStorage) -> GameLibs {
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
}
