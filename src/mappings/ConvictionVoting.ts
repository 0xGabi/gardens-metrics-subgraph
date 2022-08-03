/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent,
  ProposalExecuted as ProposalExecutedEvent,
} from "../../generated/templates/ConvictionVoting/ConvictionVoting";
import {
  getOutflowEntity,
  incrementOutflowsCount,
  populateOutflowDataFromEvent,
} from "../helpers";

export function handleProposalAdded(event: ProposalAddedEvent): void {
  const convictionVotingApp = ConvictionVotingContract.bind(event.address);
  const organization = convictionVotingApp.kernel();
  incrementOutflowsCount(organization);

  const outflow = getOutflowEntity(event.address, event.params.id);
  populateOutflowDataFromEvent(outflow, event);
  outflow.garden = organization.toHexString();

  outflow.save();
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  const proposal = getOutflowEntity(event.address, event.params.id);
  proposal.executedAt = event.block.timestamp;

  proposal.save();
}
