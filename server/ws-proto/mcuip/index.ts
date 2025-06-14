import { JSONRootRouterBase } from "../json_router";
import { type JSONObject } from "../json_router/types";
import { FlashService } from "./flash/service";
import { GlobalState } from "./global_state";
import { MonitorService } from "./monitor/service";

export class McuIpRootHandler extends JSONRootRouterBase {
  monitor: MonitorService;
  flash: FlashService;

  constructor() {
    super("service");

    this.monitor = new MonitorService(this, GlobalState.getInstance().monitor_manager);
    this.flash = new FlashService(this, GlobalState.getInstance().node_manager);
  }

  back_routing(data: JSONObject): undefined { }
}