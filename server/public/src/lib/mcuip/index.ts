import type { SharedDataInterface } from "$lib/shared_data/global";
import { writable, type Writable } from "svelte/store";

export class McuIpClient implements SharedDataInterface {
  sock: WebSocket;
  state: Writable<"Connecting" | "Connected" | "Error" | "Disconnected">
  message_handlers: { tag: string, handler: (data: object) => boolean }[] = [];

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
      const message = JSON.parse(event.data);

      const handler_called = this.message_handlers
        .map((handler) => handler.handler(message))
        .filter((result) => result).length > 0;

      if (!handler_called) {
        console.log("Unhandled message", message);
      }
    }
  }

  addMessageHandler(tag: string, handler: (data: object) => boolean) {
    this.message_handlers.push({ tag, handler });
  }

  flashDo(device_name: string) {
    this.sock.send(JSON.stringify({
      "service": "flash",
      "command": "flash",
      "device_name": device_name,
      "flash": {
        "tag": "Flash",
        "data_base64": "===="
      }
    }))
  }

  flashCreateDevice(device_name: string) {
    this.sock.send(JSON.stringify({
      "service": "flash",
      "command": "new",
      "device_name": device_name
    }))
  }

  flashSubscribe(device_name: string) {
    this.sock.send(JSON.stringify({
      "service": "flash",
      "command": "subscribe",
      "device_name": device_name
    }))
  }

  getDataState(): Writable<string> {
    return this.state;
  }
}