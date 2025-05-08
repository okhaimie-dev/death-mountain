import { getContractByName } from "@dojoengine/core";
import { useAccount } from "@starknet-react/core";
import { CallData } from 'starknet';
import { dojoConfig } from "../../dojoConfig";
import { ItemPurchase, Stats } from "../types/game";
const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;
const VRF_PROVIDER_ADDRESS = import.meta.env.VITE_PUBLIC_VRF_PROVIDER_ADDRESS;
const GAME_ADDRESS = getContractByName(dojoConfig.manifest, namespace, "game_systems")?.address
const GAME_TOKEN_ADDRESS = getContractByName(dojoConfig.manifest, namespace, "game_token_systems")?.address

/**
 * Custom hook to handle system calls and state management in the Dojo application.
 * Provides functionality for game actions and managing optimistic updates.
 *
 * @returns An object containing system call functions:
 *   - mintAndStartGame: Function to mint a new game
 *   - startGame: Function to start a new game with a weapon
 *   - explore: Function to explore the world
 *   - attack: Function to attack a beast
 *   - flee: Function to flee from a beast
 *   - equip: Function to equip items
 *   - drop: Function to drop items
 *   - levelUp: Function to level up and purchase items
 */
export const useSystemCalls = () => {
  const { account } = useAccount();

  /**
   * Executes a list of calls with optional VRF
   * @param calls Array of calls to execute
   * @param includeVRF Whether to include VRF in the transaction
   * @returns {Promise<any>} The result of the execution
   */
  const executeAction = async (calls: any[]) => {
    try {
      let tx = await account!.execute(calls, { version: 3 });
      let receipt: any = await account!.waitForTransaction(tx.transaction_hash, { retryInterval: 500 })
      console.log(receipt)
    } catch (error) {
      console.error("Error executing action:", error);
      throw error;
    }
  };

  /**
   * Mints a new game token.
   * @param account The Starknet account
   * @param name The name of the game
   * @param settingsId The settings ID for the game
   */
  const mintGame = async (account: any, name: string, settingsId = 0) => {
    try {
      let tx = await account!.execute([
        {
          contractAddress: GAME_TOKEN_ADDRESS,
          entrypoint: 'mint',
          calldata: [
            '0x' + name.split('').map((char: any) => char.charCodeAt(0).toString(16)).join(''),
            settingsId,
            1,
            1,
            account!.address
          ]
        }
      ], { version: 3 });

      const receipt: any = await account!.waitForTransaction(tx.transaction_hash, { retryInterval: 500 })
      let gameId = parseInt(receipt.events[0].data[3], 16)

      return gameId;
    } catch (error) {
      console.error("Error minting game:", error);
      throw error;
    }
  }

  /**
   * Starts a new game with a random weapon.
   * @param gameId The ID of the game to start
   * @returns {Promise<void>}
   */
  const startGame = async (gameId: number) => {
    let starterWeapons = [12, 16, 46, 76]
    let weapon = starterWeapons[Math.floor(Math.random() * starterWeapons.length)]

    await executeAction([
      requestRandom(),
      {
        contractAddress: GAME_ADDRESS,
        entrypoint: 'start_game',
        calldata: [gameId, weapon]
      }
    ]);
  };

  /**
   * Requests randomness from the VRF provider.
   */
  const requestRandom = () => {
    return {
      contractAddress: VRF_PROVIDER_ADDRESS,
      entrypoint: 'request_random',
      calldata: CallData.compile({
        caller: GAME_ADDRESS,
        source: { type: 0, address: account!.address }
      })
    }
  }

  /**
   * Explores the world, optionally until encountering a beast.
   * @param gameId The ID of the game
   * @param tillBeast Whether to explore until encountering a beast
   */
  const explore = (gameId: number, tillBeast: boolean) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'explore',
      calldata: [gameId, tillBeast]
    }
  };

  /**
   * Attacks a beast, optionally fighting to the death.
   * @param gameId The ID of the game
   * @param toTheDeath Whether to fight until death
   */
  const attack = (gameId: number, toTheDeath: boolean) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'attack',
      calldata: [gameId, toTheDeath]
    }
  };

  /**
   * Flees from a beast, optionally fleeing until death.
   * @param gameId The ID of the game
   * @param toTheDeath Whether to flee until death
   */
  const flee = (gameId: number, toTheDeath: boolean) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'flee',
      calldata: [gameId, toTheDeath]
    }
  };

  /**
   * Equips items from the adventurer's bag.
   * @param gameId The ID of the game
   * @param items Array of item IDs to equip
   */
  const equip = (gameId: number, items: number[]) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'equip',
      calldata: [gameId, items]
    }
  };

  /**
   * Drops items from the adventurer's equipment or bag.
   * @param gameId The ID of the game
   * @param items Array of item IDs to drop
   */
  const drop = (gameId: number, items: number[]) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'drop',
      calldata: [gameId, items]
    }
  };

  /**
   * Levels up the adventurer and optionally purchases items.
   * @param gameId The ID of the game
   * @param potions Number of potions to purchase
   * @param statUpgrades Object containing stat upgrades
   * @param items Array of items to purchase
   */
  const buyItems = (gameId: number, potions: number, items: ItemPurchase[]) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'buy_items',
      calldata: [gameId, potions, items]
    }
  };

  const selectStatUpgrades = (gameId: number, statUpgrades: Stats) => {
    return {
      contractAddress: GAME_ADDRESS,
      entrypoint: 'select_stat_upgrades',
      calldata: [gameId, statUpgrades]
    }
  };

  return {
    startGame,
    explore,
    attack,
    flee,
    equip,
    drop,
    buyItems,
    selectStatUpgrades,
    mintGame,
    requestRandom,
    executeAction,
  };
};
