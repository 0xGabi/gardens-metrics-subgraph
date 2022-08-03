import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 as ERC20Contract } from "../../generated/templates/ConvictionVoting/ERC20";
import {
  Garden as GardenEntity,
  Proposal as ProposalEntity,
  Token as TokenEntity,
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
export function tokenHasOrg(token: TokenEntity | null): boolean {
  return !!token && !!token.garden;
}

export function saveOrgToken(tokenId: string, orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress);
  if (!org.token) {
    org.token = tokenId;
    org.save();
  }
}

/// /// Token Entity //////
export function loadTokenData(address: Address): string {
  const id = address.toHexString();
  const token = TokenEntity.load(id);

  if (!token) {
    const token = new TokenEntity(id);
    const tokenContract = ERC20Contract.bind(address);

    // App could be instantiated without a vault which means request token could be invalid
    const symbol = tokenContract.try_symbol();
    if (symbol.reverted) {
      return null;
    }

    token.symbol = symbol.value;
    token.name = tokenContract.name();
    token.decimals = tokenContract.decimals();
    token.save();
  }

  return id;
}

/// /// Garden entity //////
export function loadOrCreateOrg(orgAddress: Address): GardenEntity {
  const id = orgAddress.toHexString();
  let garden = GardenEntity.load(id);

  if (garden === null) {
    garden = new GardenEntity(id);
    garden.outflowsCount = 0;
    garden.active = true;
    garden.createdAt = BigInt.fromI32(0);
  }

  return garden!;
}

/// /// Proposal Entity //////
export function getProposalEntityId(
  appAddress: Address,
  proposalId: BigInt
): string {
  return (
    "appAddress:" +
    appAddress.toHexString() +
    "-proposalId:" +
    proposalId.toHexString()
  );
}

export function getProposalEntity(
  appAddress: Address,
  proposalId: BigInt
): ProposalEntity {
  const proposalEntityId = getProposalEntityId(appAddress, proposalId);

  let proposal = ProposalEntity.load(proposalEntityId);
  if (!proposal) {
    proposal = new ProposalEntity(proposalEntityId);
    proposal.executedAt = BigInt.fromI32(0);
  }

  return proposal!;
}

export function incrementOutflowsCount(orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress);
  org.outflowsCount += 1;
  org.save();
}

export function incrementSupporterCount(orgAddress: Address): void {
  const org = loadOrCreateOrg(orgAddress);
  org.supporterCount += 1;
  org.save();
}

// Export local helpers
export * from "./conviction";
