import EventEmitter from "events";
import StrictEventEmitter from "strict-event-emitter-types";

export type Data = {
  c: string, // channel
  d: { [key: string]: any } // data
};

interface Events {
  rx: Data,
  tx: Data
};

type Emitter = StrictEventEmitter<EventEmitter, Events>;

export class SerialPort extends (EventEmitter as { new(): Emitter }) {
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