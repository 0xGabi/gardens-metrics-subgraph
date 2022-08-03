import { Address, BigInt, DataSourceTemplate } from "@graphprotocol/graph-ts";
import { loadOrCreateOrg, loadTokenData, saveOrgToken } from "./helpers";
import { onAppTemplateCreated } from "./hooks";
import { CONVICTION_VOTING_APPIDS, TOKENS_APPIDS } from "./constants";
import { ConvictionVoting as ConvictionVotingContract } from "../generated/templates/ConvictionVoting/ConvictionVoting";

export function processApp(
  orgAddress: Address,
  appAddress: Address,
  appId: string
): void {
  let template: string;

  if (CONVICTION_VOTING_APPIDS.includes(appId)) {
    template = "ConvictionVoting";
    const convictionVoting = ConvictionVotingContract.bind(appAddress);
    // Load tokens data
    const stakeToken = convictionVoting.stakeToken();
    const stakeTokenId = loadTokenData(stakeToken);

    const org = loadOrCreateOrg(orgAddress);

    // Save organization token if not exists (1Hive edge case)
    saveOrgToken(stakeTokenId, orgAddress);

    const stableToken = convictionVoting.stableToken();
    const stableTokenId = loadTokenData(stableToken);
    org.stableToken = stableTokenId;

    const requestToken = convictionVoting.requestToken();
    // App could be instantiated without a vault
    const requestTokenId = loadTokenData(requestToken);
    org.requestToken = requestTokenId;

    org.save();
  } else if (TOKENS_APPIDS.includes(appId)) {
    template = "HookedTokenManager";
  }

  if (template) {
    DataSourceTemplate.create(template, [appAddress.toHexString()]);
    onAppTemplateCreated(orgAddress, appAddress, appId);
  }
}

export function processOrg(orgAddress: Address, timestamp: BigInt): void {
  const org = loadOrCreateOrg(orgAddress);
  if (org.createdAt.isZero()) {
    org.createdAt = timestamp;

    org.save();
  }
}
