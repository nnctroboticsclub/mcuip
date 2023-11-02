import { JSONRootRouterBase } from "../json_router";

class McuIpRootHandler extends JSONRootRouterBase {
  constructor() {
    super("service");
  }
  back_routing(data: JSONObject): null {


    return null;
  }
}

class Handler {
  static instance: Handler;
  static getInstance(): Handler {
    if (!Handler.instance) {
      Handler.instance = new Handler();
    }
    return Handler.instance;
  }

  root_router: McuIpRootHandler;

  constructor() {
    this.root_router = new McuIpRootHandler();
  }
}