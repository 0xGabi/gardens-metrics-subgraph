import { Address } from "@graphprotocol/graph-ts";
import { Proposal as ProposalEntity } from "../../generated/schema";
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
} from "../../generated/templates/ConvictionVoting/ConvictionVoting";

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress);
  return convictionVoting.kernel();
}

/// /// Proposal entity //////
export function populateProposalDataFromEvent(
  proposal: ProposalEntity | null,
  event: ProposalAddedEvent
): void {
  proposal.requestedAmount = event.params.amount;
  proposal.createdAt = event.block.timestamp;
  proposal.beneficiary = event.params.beneficiary;
  proposal.stable = event.params.stable;
}
