import { GameQueryBuilder, getEntityModel } from "@/types/game";
import { AndComposeClause, KeysClause, MemberClause } from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { useGameStore } from '../stores/gameStore';
import { unpackAdventurer, unpackBag } from '../utils/unpack';

let gameSubscription: any = null;
const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;

const gameQuery = (gameId: number) => {
  return new GameQueryBuilder()
    .withClause(
      AndComposeClause([
        KeysClause(
          [
            `${namespace}-AdventurerPacked`,
            `${namespace}-BagPacked`,
            `${namespace}-AdventurerEntropy`
          ],
          []
        ),
        MemberClause(`${namespace}-AdventurerPacked`, "adventurer_id", "Eq", addAddressPadding(gameId)),
        MemberClause(`${namespace}-BagPacked`, "adventurer_id", "Eq", addAddressPadding(gameId)),
        MemberClause(`${namespace}-AdventurerEntropy`, "adventurer_id", "Eq", addAddressPadding(gameId)),
      ]).build()
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
    if (getEntityModel(entity, "AdventurerPacked")) {
      useGameStore.getState().setAdventurer(
        unpackAdventurer(BigInt(getEntityModel(entity, "AdventurerPacked").packed))
      );
    }

    else if (getEntityModel(entity, "BagPacked")) {
      useGameStore.getState().setBag(
        unpackBag(BigInt(getEntityModel(entity, "BagPacked").packed))
      );
    }

    else if (getEntityModel(entity, "AdventurerEntropy")) {
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
    const [_, subscription] = await sdk.subscribeEntityQuery({
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

    gameSubscription = subscription;
  } catch (error) {
    console.error('Subscription error:', error);
    return () => { };
  }
}