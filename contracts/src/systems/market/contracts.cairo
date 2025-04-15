use lootsurvivor::constants::combat::CombatEnums::Tier;

#[starknet::interface]
pub trait IMarketSystems<T> {
    fn get_price(self: @T, tier: Tier) -> u16;
    fn get_available_items(self: @T, seed: u64, market_size: u8) -> Array<u8>;
    fn get_market_size(self: @T, stat_upgrades_available: u8) -> u8;
    fn get_id(self: @T, seed: u64) -> u8;
    fn is_item_available(self: @T, market_inventory: Span<u8>, item_id: u8) -> bool;
    fn get_all_items(self: @T) -> Array<u8>;
    fn get_market_seed_and_offset(self: @T, seed: u64) -> (u64, u8);
}

#[dojo::contract]
mod market_systems {
    use super::IMarketSystems;
    use lootsurvivor::constants::combat::CombatEnums::Tier;
    use lootsurvivor::models::market::ImplMarket;

    #[abi(embed_v0)]
    impl MarketSystemsImpl of IMarketSystems<ContractState> {
        fn get_price(self: @ContractState, tier: Tier) -> u16 {
            ImplMarket::get_price(tier)
        }

        fn get_available_items(self: @ContractState, seed: u64, market_size: u8) -> Array<u8> {
            ImplMarket::get_available_items(seed, market_size)
        }

        fn get_market_size(self: @ContractState, stat_upgrades_available: u8) -> u8 {
            ImplMarket::get_market_size(stat_upgrades_available)
        }

        fn get_id(self: @ContractState, seed: u64) -> u8 {
            ImplMarket::get_id(seed)
        }

        fn is_item_available(self: @ContractState, mut market_inventory: Span<u8>, item_id: u8) -> bool {
            ImplMarket::is_item_available(ref market_inventory, item_id)
        }

        fn get_all_items(self: @ContractState) -> Array<u8> {
            ImplMarket::get_all_items()
        }

        fn get_market_seed_and_offset(self: @ContractState, seed: u64) -> (u64, u8) {
            ImplMarket::get_market_seed_and_offset(seed)
        }
    }
}