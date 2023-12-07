import { JSONRootRouterBase } from "../json_router";
import { JSONObject } from "../json_router/types";
import { FlashService } from "./flash/service";
import { GlobalState } from "./global_state";
import { MonitorService } from "./monitor/service";

export class McuIpRootHandler extends JSONRootRouterBase {
  constructor() {
    super("service");

    new MonitorService(this, GlobalState.getInstance().monitor_manager);
    new FlashService(this, GlobalState.getInstance().node_manager);
  }

  back_routing(data: JSONObject): null {
    return null;
  }
}