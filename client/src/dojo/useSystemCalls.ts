import { useAccount } from "@starknet-react/core";
import { CallData, provider } from 'starknet';
import { useSnackbar } from 'notistack';
import { getContractByName } from "@dojoengine/core";
import { dojoConfig } from "../../dojoConfig";

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;
const VRF_PROVIDER_ADDRESS = import.meta.env.VITE_PUBLIC_VRF_PROVIDER_ADDRESS;
const GAME_ADDRESS = getContractByName(dojoConfig.manifest, namespace, "game_systems")?.address
const GAME_TOKEN_ADDRESS = getContractByName(dojoConfig.manifest, namespace, "game_token_systems")?.address

/**
 * Custom hook to handle system calls and state management in the Dojo application.
 * Provides functionality for game actions and managing optimistic updates.
 *
 * @returns An object containing system call functions:
 *   - mintGame: Function to mint a new game
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
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Executes a list of calls with optional VRF
   * @param calls Array of calls to execute
   * @param includeVRF Whether to include VRF in the transaction
   * @returns {Promise<any>} The result of the execution
   */
  const executeAction = async (calls: any[], includeVRF: boolean = false) => {
    if (includeVRF) {
      const vrfCall = {
        contractAddress: VRF_PROVIDER_ADDRESS,
        entrypoint: 'request_random',
        calldata: CallData.compile({
          caller: GAME_ADDRESS,
          source: { type: 0, address: account!.address }
        })
      };
      calls.unshift(vrfCall);
    }

    let tx = await account!.execute(calls, { version: 3 });
    const receipt: any = await account!.waitForTransaction(tx.transaction_hash, { retryInterval: 1000 })

    console.log('contract error', receipt)
    if (receipt?.execution_status === "REVERTED") {
      console.log('contract error', receipt)
      enqueueSnackbar("Transaction has failed", { variant: "error" });
    }
  };

  const mintGame = async (name: string, settingsId = 0) => {
    console.log("Minting game:", name, settingsId);
    try {
      await executeAction([
        {
          contractAddress: GAME_TOKEN_ADDRESS,
          entrypoint: 'mint',
          calldata: [
            '0x' + name.split('').map(char => char.charCodeAt(0).toString(16)).join(''),
            settingsId,
            1,
            1,
            account!.address
          ]
        }
      ], false);
    } catch (error) {
      console.error("Error minting game:", error);
      throw error;
    }
  }

  /**
   * Starts a new game with the provided weapon.
   * @param gameId The ID of the game to start
   * @param weapon The weapon ID to start with
   * @returns {Promise<void>}
   */
  const startGame = async (gameId: number, weapon: number) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'start_game',
          calldata: [gameId, weapon]
        }
      ], false);
    } catch (error) {
      console.error("Error starting game:", error);
      throw error;
    }
  };

  /**
   * Explores the world, optionally until encountering a beast.
   * @param gameId The ID of the game
   * @param tillBeast Whether to explore until encountering a beast
   * @returns {Promise<void>}
   */
  const explore = async (gameId: number, tillBeast: boolean) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'explore',
          calldata: [gameId, tillBeast]
        }
      ], false);
    } catch (error) {
      console.error("Error exploring:", error);
      throw error;
    }
  };

  /**
   * Attacks a beast, optionally fighting to the death.
   * @param gameId The ID of the game
   * @param toTheDeath Whether to fight until death
   * @returns {Promise<void>}
   */
  const attack = async (gameId: number, toTheDeath: boolean) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'attack',
          calldata: [gameId, toTheDeath]
        }
      ], false);
    } catch (error) {
      console.error("Error attacking:", error);
      throw error;
    }
  };

  /**
   * Flees from a beast, optionally fleeing until death.
   * @param gameId The ID of the game
   * @param toTheDeath Whether to flee until death
   * @returns {Promise<void>}
   */
  const flee = async (gameId: number, toTheDeath: boolean) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'flee',
          calldata: [gameId, toTheDeath]
        }
      ], false);
    } catch (error) {
      console.error("Error fleeing:", error);
      throw error;
    }
  };

  /**
   * Equips items from the adventurer's bag.
   * @param gameId The ID of the game
   * @param items Array of item IDs to equip
   * @param includeVRF Whether to include VRF in the transaction
   * @returns {Promise<void>}
   */
  const equip = async (gameId: number, items: number[], includeVRF: boolean = false) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'equip',
          calldata: [gameId, items]
        }
      ], includeVRF);
    } catch (error) {
      console.error("Error equipping items:", error);
      throw error;
    }
  };

  /**
   * Drops items from the adventurer's equipment or bag.
   * @param gameId The ID of the game
   * @param items Array of item IDs to drop
   * @returns {Promise<void>}
   */
  const drop = async (gameId: number, items: number[]) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'drop',
          calldata: [gameId, items]
        }
      ], false);
    } catch (error) {
      console.error("Error dropping items:", error);
      throw error;
    }
  };

  /**
   * Levels up the adventurer and optionally purchases items.
   * @param gameId The ID of the game
   * @param potions Number of potions to purchase
   * @param statUpgrades Object containing stat upgrades
   * @param items Array of items to purchase
   * @returns {Promise<void>}
   */
  const levelUp = async (gameId: number, potions: number, statUpgrades: any, items: any[]) => {
    try {
      await executeAction([
        {
          contractAddress: GAME_ADDRESS,
          entrypoint: 'level_up',
          calldata: [gameId, potions, statUpgrades, items]
        }
      ], false);
    } catch (error) {
      console.error("Error leveling up:", error);
      throw error;
    }
  };

  return {
    mintGame,
    startGame,
    explore,
    attack,
    flee,
    equip,
    drop,
    levelUp,
  };
};
