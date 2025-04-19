import { GameEntity, GameModelType, GameQueryBuilder, GameSchemaModelNames } from "@/types/game";
import { MemberClause, OrComposeClause } from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useGameStore } from '../stores/gameStore';
import { unpackAdventurer, unpackBag } from '../utils/unpack';

let currentSubscription: any = null;

export const getEntityModel = <M extends GameModelType>(entity: GameEntity, modelName: GameSchemaModelNames): M => (
  entity?.models.lootsurvivor?.[modelName] as M
)

const updateGameStore = (entities: any) => {
  entities.forEach((entity: any) => {
    if (getEntityModel(entity, "AdventurerPacked")) {
      useGameStore.getState().setAdventurer(unpackAdventurer(entity));
    }

    else if (getEntityModel(entity, "BagPacked")) {
      useGameStore.getState().setBag(unpackBag(entity));
    }

    else if (getEntityModel(entity, "AdventurerEntropy")) {
      useGameStore.getState().setEntropy(entity);
    }
  });
}

export async function setupGameSubscription(gameId: string) {
  const { sdk } = useDojoSDK();

  // Cancel existing subscription if any
  if (currentSubscription) {
    currentSubscription.cancel();
    currentSubscription = null;
  }

  const gameQuery: GameQueryBuilder = new GameQueryBuilder()
    .withEntityModels([
      "lootsurvivor-AdventurerPacked",
      "lootsurvivor-BagPacked",
      "lootsurvivor-AdventurerEntropy"
    ])
    .withClause(
      OrComposeClause([
        MemberClause("lootsurvivor-AdventurerPacked", "adventurer_id", "Eq", gameId),
        MemberClause("lootsurvivor-BagPacked", "adventurer_id", "Eq", gameId),
        MemberClause("lootsurvivor-AdventurerEntropy", "id", "Eq", gameId),
      ]).build()
    )
    .includeHashedKeys()

  try {
    const [initialEntities, subscription] = await sdk.subscribeEntityQuery({
      query: gameQuery,
      callback: ({ data, error }) => {
        if (error) {
          console.error('Subscription error:', error);
        } else if (data) {
          updateGameStore(data);
        }
      }
    })

    if (initialEntities) {
      updateGameStore(initialEntities);
    }

    currentSubscription = subscription;
  } catch (error) {
    console.error('Subscription error:', error);
    return () => {};
  }
} 