import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 as ERC20Contract } from "../../generated/templates/ConvictionVoting/ERC20";
import {
  Beneficiary as BeneficiaryEntity,
  Garden as GardenEntity,
  Outflow as OutflowEntity,
  Token,
  Contributor as ContributorEntity,
} from "../../generated/schema";

export const MAX_UINT_256 = BigInt.fromUnsignedBytes(
  Bytes.fromHexString(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  ) as Bytes
);

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

/// /// Token Entity //////
export function loadToken(address: Address): Token {
  const id = address.toHexString();
  let token = Token.load(id);

  if (token === null) {
    token = new Token(id);
    const tokenContract = ERC20Contract.bind(address);

    // App could be instantiated without a vault which means request token could be invalid
    const symbol = tokenContract.try_symbol();
    if (symbol.reverted) {
      token.symbol;
    } else {
      token.symbol = symbol.value;
    }

    token.name = tokenContract.name();
    token.decimals = tokenContract.decimals();
    token.garden = ZERO_ADDRESS.toHex();
    token.save();
  }

  return token;
}

/// /// Garden entity //////
export function loadOrCreateGarden(gardenAddress: Address): GardenEntity {
  const id = gardenAddress.toHexString();
  let garden = GardenEntity.load(id);

  if (garden === null) {
    garden = new GardenEntity(id);
    garden.outflowsCount = 0;
    garden.createdAt = 0;
    garden.address = gardenAddress;
    garden.save();
  }

  return garden;
}

/// /// Proposal Entity //////
export function getOutflowId(
  gardenAddress: Address,
  proposalId: BigInt
): string {
  return (
    "gardenAddress:" +
    gardenAddress.toHexString() +
    "-proposalId:" +
    proposalId.toHexString()
  );
}

export function loadOrCreateOutflow(
  gardenAddress: Address,
  proposalId: BigInt
): OutflowEntity {
  const outflowId = getOutflowId(gardenAddress, proposalId);

  let outflow = OutflowEntity.load(outflowId);
  if (!outflow) {
    outflow = new OutflowEntity(outflowId);
    outflow.save();
  }

  return outflow;
}

export function getBeneficiaryId(
  gardenAddress: Address,
  beneficiary: Address
): string {
  return (
    "gardenAddress:" +
    gardenAddress.toHexString() +
    "-beneficiary:" +
    beneficiary.toHexString()
  );
}

export function loadOrCreateBeneficiary(
  gardenAddress: Address,
  beneficiaryAddress: Address
): BeneficiaryEntity {
  const beneficiaryId = getBeneficiaryId(gardenAddress, beneficiaryAddress);

  let beneficiary = BeneficiaryEntity.load(beneficiaryId);
  if (!beneficiary) {
    beneficiary = new BeneficiaryEntity(beneficiaryId);
    beneficiary.address = beneficiaryAddress;
    beneficiary.garden = gardenAddress.toHex();
    beneficiary.totalRecived = new BigInt(0);
    beneficiary.save();
  }

  return beneficiary;
}

export function getContributorId(
  gardenAddress: Address,
  contributor: Address
): string {
  return (
    "gardenAddress:" +
    gardenAddress.toHexString() +
    "-contributor:" +
    contributor.toHexString()
  );
}

export function loadOrCreateContributor(
  gardenAddress: Address,
  contributorAddress: Address
): ContributorEntity {
  const contributorId = getContributorId(gardenAddress, contributorAddress);

  let contributor = ContributorEntity.load(contributorId);
  if (!contributor) {
    contributor = new ContributorEntity(contributorId);
    contributor.address = contributorAddress;
    contributor.garden = gardenAddress.toHex();
    contributor.totalRecived = new BigInt(0);
    contributor.save();
  }

  return contributor;
}

// Export local helpers
export * from "./conviction";
