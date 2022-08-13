import { DeployDao as DeployDaoEvent } from "../../generated/GardensTemplate/GardensTemplate";
import { Kernel as KernelTemplate } from "../../generated/templates";
import { loadOrCreateGarden } from "../helpers";

export function handleDeployDao(event: DeployDaoEvent): void {
  const garden = loadOrCreateGarden(event.params.dao);
  garden.createdAt = event.block.timestamp.toI32();
  garden.save();

  KernelTemplate.create(event.params.dao);
}
