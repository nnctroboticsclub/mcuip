import { Emitter } from "strict-event-emitter";

export type Data = {
  c: string, // channel
  d: { [key: string]: any } // data
};

type Events = {
  "rx": [Data],
  "tx": [Data],
};

export class SerialPort extends Emitter<Events> {
  constructor(private port_name: string) {
    super()
  }

  get name() {
    return this.port_name;
  }

  rx(data: Data) {
    this.emit("rx", data);
  }

  tx(data: Data) {
    this.emit("tx", data);
  }

  debug() {
    this.on("rx", data => console.log(`[${this.port_name}] RX: ${data}`));
    this.on("tx", data => console.log(`[${this.port_name}] TX: ${data}`));
  }
}