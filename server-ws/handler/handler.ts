import { JSONRootRouterBase } from "../json_router";
import { GlobalState } from "./global_state";
import { SerialService } from "./serial/service";

class McuIpRootHandler extends JSONRootRouterBase {
  constructor() {
    super("service");

    new SerialService(this, GlobalState.getInstance().serial_manager);

  }
  back_routing(data: JSONObject): null {


    return null;
  }
}