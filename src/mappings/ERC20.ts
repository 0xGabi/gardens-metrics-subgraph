import { Address } from "@graphprotocol/graph-ts";
import { Beneficiary, ContributorOutflow } from "../../generated/schema";
import { Transfer as TransferEvent } from "../../generated/templates/ERC20/ERC20";
import {
  getBeneficiaryId,
  loadOrCreateContributor,
  loadOrCreateGarden,
  loadToken,
} from "../helpers";

export function handleTransfer(event: TransferEvent): void {
  const token = loadToken(event.address);
  const garden = loadOrCreateGarden(Address.fromString(token.garden));

  const beneficiaryId = getBeneficiaryId(
    Address.fromString(garden.id),
    event.params.from
  );

  let beneficiary = Beneficiary.load(beneficiaryId);
  if (beneficiary) {
    // TODO: check the beneficiary is a gnosis safe address

    const contributor = loadOrCreateContributor(
      Address.fromString(garden.id),
      event.params.to
    );

    contributor.totalRecived = contributor.totalRecived.plus(
      event.params.value
    );

    const contributorOutflow = new ContributorOutflow(
      event.transaction.hash.toHex()
    );

    contributorOutflow.amount = event.params.value;
    contributorOutflow.transferAt = event.block.timestamp.toI32();
    contributorOutflow.token = token.id;
    contributorOutflow.beneficiary = beneficiary.id;
    contributorOutflow.contributor = contributor.id;

    contributorOutflow.save();
    contributor.save();
    beneficiary.save();
  }
}
