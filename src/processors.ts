import { Address, BigInt, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { loadOrCreateGarden, loadToken } from "./helpers";
import { CONVICTION_VOTING_APPIDS } from "./constants";
import { ConvictionVoting as ConvictionVotingContract } from "../generated/templates/ConvictionVoting/ConvictionVoting";

export function processApp(
  gardenAddress: Address,
  appAddress: Address,
  appId: string
): void {
  if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    const convictionVoting = ConvictionVotingContract.bind(appAddress);
    // Load tokens data
    const garden = loadOrCreateGarden(gardenAddress);

    const requestToken = convictionVoting.requestToken();
    // App could be instantiated without a vault
    const requestTokenEntity = loadToken(requestToken);
    requestTokenEntity.garden = gardenAddress.toHex();

    requestTokenEntity.save();

    garden.requestToken = requestTokenEntity.id;

    garden.save();

    DataSourceTemplate.create("ERC20", [requestToken.toHexString()]);
    DataSourceTemplate.create("ConvictionVoting", [appAddress.toHexString()]);
  }
}

export function processGarden(gardenAddress: Address, timestamp: BigInt): void {
  const garden = loadOrCreateGarden(gardenAddress);
  if (garden.createdAt == 0) {
    garden.createdAt = timestamp.toI32();

    garden.save();
  }
}
