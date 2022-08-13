import { NewAppProxy as NewAppProxyEvent } from "../../generated/templates/Kernel/Kernel";
import { processApp, processGarden } from "../processors";

export function handleNewAppProxy(event: NewAppProxyEvent): void {
  processGarden(event.address, event.block.timestamp);
  processApp(
    event.address,
    event.params.proxy,
    event.params.appId.toHexString()
  );
}
