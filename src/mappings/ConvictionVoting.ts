/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
  ProposalExecuted as ProposalExecutedEvent,
} from "../../generated/templates/ConvictionVoting/ConvictionVoting";
import {
  getProposalEntity,
  incrementOutflowsCount,
  populateProposalDataFromEvent,
} from "../helpers";

export function handleProposalAdded(event: ProposalAddedEvent): void {
  const convictionVotingApp = ConvictionVotingContract.bind(event.address);
  const organization = convictionVotingApp.kernel();
  incrementOutflowsCount(organization);

  const proposal = getProposalEntity(event.address, event.params.id);
  populateProposalDataFromEvent(proposal, event);
  proposal.organization = organization.toHexString();

  proposal.save();
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  const proposal = getProposalEntity(event.address, event.params.id);
  proposal.executedAt = event.block.timestamp;

  proposal.save();
}
