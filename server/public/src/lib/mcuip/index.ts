import type { SharedDataInterface } from "$lib/shared_data/global";
import { writable, type Writable } from "svelte/store";
import { McuIpRootHandler } from "../../../../ws-proto/mcuip";
import { JSONRootRouterBase } from "../../../../ws-proto/json_router";
import type { JSONObject } from "../../../../ws-proto/json_router/types";

export class McuIpHandler extends McuIpRootHandler {
  state: Writable<"Connecting" | "Connected" | "Error" | "Disconnected">;

  constructor(private sock: WebSocket) {
    super();

    this.state = writable("Connecting");

    this.sock.onopen = () => {
      this.state.set("Connected");
    }

    this.sock.onclose = () => {
      this.state.set("Disconnected");
    }

    this.sock.onerror = (error) => {
      this.state.set("Error");
      console.log(error);
    }

    this.sock.onmessage = (event) => {
      this.route(JSON.parse(event.data));
    }
  }

  getDataState(): Writable<string> {
    return this.state;
  }

  back_routing(data: JSONObject): undefined {
    this.sock.send(JSON.stringify(data));
  }
}