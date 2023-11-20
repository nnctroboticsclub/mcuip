import { ServerWebSocket } from "bun";
import { McuIpRootHandler } from "../handler/handler";

export type WSData = {
  router: WebSocketJSONRootRouter
};

export class WebSocketJSONRootRouter extends McuIpRootHandler {
  constructor(private socket: ServerWebSocket<WSData>) {
    super();
  }

  handle_back_routing(data: JSONObject) {
    this.socket.send(JSON.stringify(data));
    return null;
  }
}