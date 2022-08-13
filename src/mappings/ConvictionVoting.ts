import {
  ProposalAdded as ProposalAddedEvent,
  ProposalExecuted as ProposalExecutedEvent,
} from "../../generated/templates/ConvictionVoting/ConvictionVoting";
import {
  loadOrCreateOutflow,
  loadOrCreateGarden,
  loadOrCreateBeneficiary,
  getGardenAddress,
  ZERO_ADDRESS,
} from "../helpers";

export function handleProposalAdded(event: ProposalAddedEvent): void {
  if (ZERO_ADDRESS.notEqual(event.params.beneficiary)) {
    const gardenAddress = getGardenAddress(event.address);
    const garden = loadOrCreateGarden(gardenAddress);
    garden.outflowsCount += 1;
    garden.save();

    const outflow = loadOrCreateOutflow(gardenAddress, event.params.id);

    outflow.requestedAmount = event.params.amount;
    outflow.stable = event.params.stable;
    outflow.garden = gardenAddress.toHexString();

    const beneficiary = loadOrCreateBeneficiary(
      gardenAddress,
      event.params.beneficiary
    );
    beneficiary.requestTokenBalance = beneficiary.requestTokenBalance.plus(
      event.params.amount
    );

    outflow.beneficiary = beneficiary.id;

    outflow.save();
    beneficiary.save();
  }
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  const gardenAddress = getGardenAddress(event.address);
  const proposal = loadOrCreateOutflow(gardenAddress, event.params.id);
  proposal.transferAt = event.block.timestamp.toI32();

  proposal.save();
}
