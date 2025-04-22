import { AndComposeClause, KeysClause, MemberClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { dojoConfig } from "../../dojoConfig";
import { addAddressPadding } from "starknet";

const namespace = import.meta.env.VITE_PUBLIC_NAMESPACE;

export const fetchGameTokens = async (address: string) => {
  let url = `${dojoConfig.toriiUrl}/sql?query=
    SELECT token_id FROM token_balances
    WHERE account_address = "${address.replace(/^0x0+/, "0x")}" AND contract_address = "${import.meta.env.VITE_PUBLIC_GAME_ADDRESS}"
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

const fetchTokenMetadata = (tokenIds: string[]) => {
  return new ToriiQueryBuilder()
    .withClause(
      AndComposeClause([
        KeysClause(
          [`${namespace}-TokenMetadata`, `${namespace}-AdventurerPacked`],
          []
        ),
        MemberClause(`${namespace}-AdventurerPacked`, "adventurer_id", "In", tokenIds),
        MemberClause(`${namespace}-TokenMetadata`, "token_id", "In", tokenIds),
      ]).build()
    )
    .withEntityModels([
      `${namespace}-TokenMetadata`,
      `${namespace}-AdventurerPacked`,
    ])
    .includeHashedKeys()
}

let tokenMintedSubscription: any = null;
export async function setupTokenMintSubscription(sdk: any, mintedBy: string) {
  // Cancel existing subscription if any
  if (tokenMintedSubscription) {
    tokenMintedSubscription.cancel();
    tokenMintedSubscription = null;
  }

  try {
    const [_, subscription] = await sdk.subscribeEntityQuery({
      query: new ToriiQueryBuilder()
        .withClause(
          AndComposeClause([
            KeysClause(
              [`${namespace}-TokenMetadata`],
              []
            ),
            MemberClause(`${namespace}-TokenMetadata`, "minted_by", "Eq", addAddressPadding(mintedBy)),
          ]).build()
        )
        .withEntityModels([
          `${namespace}-TokenMetadata`,
        ])
        .includeHashedKeys(),

      callback: ({ data, error }: { data: any, error: Error | null }) => {
        if (error) {
          console.error('Subscription error:', error);
        } else if (data) {
          console.log("Subscription Data:", data);
        }
      }
    })

    tokenMintedSubscription = subscription;
  } catch (error) {
    console.error('Subscription error:', error);
    return () => { };
  }
}