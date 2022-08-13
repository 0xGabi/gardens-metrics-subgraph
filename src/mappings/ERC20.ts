import { Address } from "@graphprotocol/graph-ts";
import { Beneficiary, Transfer } from "../../generated/schema";
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

    beneficiary.requestTokenBalance = beneficiary.requestTokenBalance.minus(
      event.params.value
    );

    const contributor = loadOrCreateContributor(
      Address.fromString(garden.id),
      event.params.to
    );

    contributor.requestTokenBalance = contributor.requestTokenBalance.plus(
      event.params.value
    );

    const transfer = new Transfer(event.transaction.hash.toHex());

    transfer.amount = event.params.value;
    transfer.createdAt = event.block.timestamp.toI32();
    transfer.token = token.id;
    transfer.beneficiary = beneficiary.id;
    transfer.contributor = contributor.id;

    transfer.save();
    contributor.save();
    beneficiary.save();
  }
}
