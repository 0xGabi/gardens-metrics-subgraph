import { Address } from "@graphprotocol/graph-ts";
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
    outflow.beneficiary = event.params.beneficiary;

    outflow.save();
  }
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  const gardenAddress = getGardenAddress(event.address);
  const outflow = loadOrCreateOutflow(gardenAddress, event.params.id);
  const beneficiary = loadOrCreateBeneficiary(
    gardenAddress,
    Address.fromString(outflow.beneficiary!.toHex())
  );
  beneficiary.requestTokenBalance = beneficiary.requestTokenBalance.plus(
    outflow.requestedAmount!
  );

  outflow.transferAt = event.block.timestamp.toI32();

  outflow.save();
  beneficiary.save();
}
