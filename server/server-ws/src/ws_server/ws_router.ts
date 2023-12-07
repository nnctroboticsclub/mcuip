import { ServerWebSocket } from "bun";
import { McuIpRootHandler } from "../../../ws-proto/mcuip-ws-proto/handler";
import { JSONObject } from "../../../ws-proto/json_router/types";

export type WSData = {
  router: WebSocketJSONRootRouter
};

export class WebSocketJSONRootRouter extends McuIpRootHandler {
  constructor(private socket: ServerWebSocket<WSData>) {
    super();
  }

  handle_back_routing(data: JSONObject) {
    console.log("Received back routing data: ", data);
    this.socket.send(JSON.stringify(data));
    return null;
  }
}