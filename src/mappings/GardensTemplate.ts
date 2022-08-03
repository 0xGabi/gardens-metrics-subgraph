import {
  DeployDao as DeployDaoEvent,
  SetupDao as SetupDaoEvent,
} from "../../generated/GardensTemplate/GardensTemplate";
import { Kernel as KernelTemplate } from "../../generated/templates";
import { loadOrCreateOrg } from "../helpers";

export function handleDeployDao(event: DeployDaoEvent): void {
  const org = loadOrCreateOrg(event.params.dao);
  org.createdAt = event.block.timestamp;
  org.active = false;
  org.save();

  KernelTemplate.create(event.params.dao);
}

export function handleSetupDao(event: SetupDaoEvent): void {
  const orgAddress = event.params.dao;
  const org = loadOrCreateOrg(orgAddress);

  // Set org as active when dao setup finished
  org.active = true;
  org.save();
}
