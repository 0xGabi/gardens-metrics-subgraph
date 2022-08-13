import { Address } from "@graphprotocol/graph-ts";
import { ConvictionVoting as ConvictionVotingContract } from "../../generated/templates/ConvictionVoting/ConvictionVoting";

export function getGardenAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress);
  return convictionVoting.kernel();
}
