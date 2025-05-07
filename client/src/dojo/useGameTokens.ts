import { ClauseBuilder, ToriiQueryBuilder } from "@dojoengine/sdk";
import { hexToAscii } from "@dojoengine/utils";

import { useGameStore } from "@/stores/gameStore";
import { getEntityModel } from "@/types/game";
import { getShortNamespace } from "@/utils/utils";
import { getContractByName } from "@dojoengine/core";
import { gql, request } from 'graphql-request';
import { addAddressPadding } from "starknet";
import { dojoConfig } from "../../dojoConfig";
import { unpackAdventurer } from "@/utils/unpack";

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;
const GAME_TOKEN_ADDRESS = getContractByName(dojoConfig.manifest, namespace, "game_token_systems")?.address
const NS_SHORT = getShortNamespace(namespace)

export const fetchGameTokenIds = async (address: string) => {
  let url = `${dojoConfig.toriiUrl}/sql?query=
    SELECT token_id FROM token_balances
    WHERE account_address = "${address.replace(/^0x0+/, "0x")}" AND contract_address = "${GAME_TOKEN_ADDRESS}"
    LIMIT 10000`

  const sql = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  let data = await sql.json()
  return data.map((token: any) => parseInt(token.token_id.split(":")[1], 16))
}

export async function fetchMetadata(sdk: any, tokenId: number) {
  const entities = await sdk.getEntities({
    query: new ToriiQueryBuilder()
      .withClause(
        new ClauseBuilder().keys(
          [
            `${namespace}-TokenMetadata`,
          ],
          [addAddressPadding(`0x${tokenId.toString(16)}`)]
        ).build()
      )
      .withEntityModels([
        `${namespace}-TokenMetadata`,
      ])
      .includeHashedKeys()
  });

  let data = getEntityModel(entities[0], "TokenMetadata")

  useGameStore.getState().setMetadata({
    player_name: hexToAscii(data.player_name),
    settings_id: parseInt(data.settings_id, 16),
    minted_by: data.minted_by,
    expires_at: parseInt(data.lifecycle.end.Some || 0, 16) * 1000,
    available_at: parseInt(data.lifecycle.start.Some || 0, 16) * 1000,
  })
}

export const fetchGameTokensData = async (tokenIds: string[]) => {
  tokenIds = tokenIds.map(tokenId => `"${tokenId.toString()}"`);

  const document = gql`
  {
    ${NS_SHORT}TokenMetadataModels (limit:10000, where:{
      token_idIN:[${tokenIds}]}
    ){
      edges {
        node {
          token_id
          player_name
          settings_id
          minted_by
          lifecycle {
            start {
              Some
            }
            end {
              Some
            }
          }
        }
      }
    }

    ${NS_SHORT}AdventurerPackedModels (limit:10000, where:{
      adventurer_idIN:[${tokenIds}]}
    ){
      edges {
        node {
          adventurer_id
          packed
        }
      }
    }
  }`

  try {
    const res: any = await request(dojoConfig.toriiUrl + "/graphql", document)
    let tokenMetadata = res?.[`${NS_SHORT}TokenMetadataModels`]?.edges.map((edge: any) => edge.node) ?? []
    let adventurerData = res?.[`${NS_SHORT}AdventurerPackedModels`]?.edges.map((edge: any) => edge.node) ?? []

    let games = tokenMetadata.map((metaData: any) => {
      let adventurerPacked = adventurerData.find((adventurer: any) => adventurer.adventurer_id === metaData.token_id)
      let adventurer = adventurerPacked ? unpackAdventurer(BigInt(adventurerPacked.packed)) : { health: 0, xp: 0, gold: 0 }

      let tokenId = parseInt(metaData.token_id, 16)
      let expires_at = parseInt(metaData.lifecycle.end.Some || 0, 16) * 1000
      let available_at = parseInt(metaData.lifecycle.start.Some || 0, 16) * 1000

      return {
        ...adventurer,
        adventurer_id: tokenId,
        player_name: hexToAscii(metaData.player_name),
        settings_id: parseInt(metaData.settings_id, 16),
        minted_by: metaData.minted_by,
        expires_at,
        available_at,
        expired: expires_at !== 0 && expires_at < Date.now(),
        dead: adventurer.xp !== 0 && adventurer.health === 0,
      }
    })

    return games
  } catch (ex) {
    return []
  }
}