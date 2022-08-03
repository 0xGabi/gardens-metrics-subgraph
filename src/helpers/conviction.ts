import { Address } from "@graphprotocol/graph-ts";
import { Outflow as OutflowEntity } from "../../generated/schema";
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
} from "../../generated/templates/ConvictionVoting/ConvictionVoting";

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress);
  return convictionVoting.kernel();
}

/// /// Outflow entity //////
export function populateOutflowDataFromEvent(
  outflow: OutflowEntity | null,
  event: ProposalAddedEvent
): void {
  outflow.requestedAmount = event.params.amount;
  outflow.createdAt = event.block.timestamp;
  outflow.beneficiary = event.params.beneficiary;
  outflow.stable = event.params.stable;
}
