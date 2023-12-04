import type { SharedDataInterface } from "$lib/shared_data/global";
import { writable, type Writable } from "svelte/store";

export class McuIpClient implements SharedDataInterface {
  sock: WebSocket;
  state: Writable<"Connecting" | "Connected" | "Error" | "Disconnected">

  constructor(url: string) {
    this.sock = new WebSocket(url);
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
      if (event.data instanceof ArrayBuffer) {
        console.log(`Websocket: Received ArrayBuffer of length ${event.data.byteLength} from ${event.origin}`);
      } else if (event.data instanceof Blob) {
        console.log(`Websocket: Received Blob of size ${event.data.size} from ${event.origin}`);
      } else if (event.data instanceof String) {
        console.log(`Websocket: Received string ${event.data} from ${event.origin}`);
      }
    }
  }

  getDataState(): Writable<string> {
    return this.state;
  }
}