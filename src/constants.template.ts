import { Address } from "@graphprotocol/graph-ts"

export const CONVICTION_VOTING_APPIDS: string[] = [{{#convictionVotingAppIds}}'{{id}}',{{/convictionVotingAppIds}}]
export const TOKENS_APPIDS: string[] = [{{#tokensAppIds}}'{{id}}',{{/tokensAppIds}}]

export const ONE_HIVE_GARDEN_ADDRESS: Address = Address.fromString('{{1HiveGarden}}')