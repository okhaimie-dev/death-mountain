import { GameQueryBuilder, getEntityModel } from "@/types/game";
import { ClauseBuilder } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { useGameStore } from '../stores/gameStore';
import { unpackAdventurer, unpackBag } from '../utils/unpack';

let gameSubscription: any = null;
const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;

const gameQuery = (gameId: number) => {
  return new GameQueryBuilder()
    .withClause(
      new ClauseBuilder().keys(
        [
          `${namespace}-AdventurerPacked`,
          `${namespace}-BagPacked`,
          `${namespace}-AdventurerEntropy`
        ],
        [addAddressPadding(gameId)]
      ).build()
    )
    .withEntityModels([
      `${namespace}-AdventurerPacked`,
      `${namespace}-BagPacked`,
      `${namespace}-AdventurerEntropy`
    ])
    .includeHashedKeys()
}

const updateGameStore = (entities: any) => {
  entities.forEach((entity: any) => {
    if (Boolean(getEntityModel(entity, "AdventurerPacked"))) {
      useGameStore.getState().setAdventurer(
        unpackAdventurer(BigInt(getEntityModel(entity, "AdventurerPacked").packed))
      );
    }

    if (Boolean(getEntityModel(entity, "BagPacked"))) {
      useGameStore.getState().setBag(
        unpackBag(BigInt(getEntityModel(entity, "BagPacked").packed))
      );
    }

    if (Boolean(getEntityModel(entity, "AdventurerEntropy"))) {
      useGameStore.getState().setEntropy(getEntityModel(entity, "AdventurerEntropy"));
    }
  });
}

export async function fetchGameState(sdk: any, gameId: number) {
  const entities = await sdk.getEntities({
    query: gameQuery(gameId),
  });

  updateGameStore(entities);
}

export async function setupGameSubscription(sdk: any, gameId: number) {
  // Cancel existing subscription if any
  if (gameSubscription) {
    gameSubscription.cancel();
    gameSubscription = null;
  }

  try {
    const [initialData, subscription] = await sdk.subscribeEntityQuery({
      query: gameQuery(gameId),
      callback: ({ data, error }: { data: any, error: Error | null }) => {
        if (error) {
          console.error('Subscription error:', error);
        } else if (data) {
          console.log("Subscription Data:", data);
          updateGameStore(data);
        }
      }
    })

    if (initialData && initialData.length === 0) {
      useGameStore.getState().setNewGame(true);
    } else {
      updateGameStore(initialData)
    }

    gameSubscription = subscription;
  } catch (error) {
    console.error('Subscription error:', error);
    return () => { };
  }
}