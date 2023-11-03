import EventEmitter from "events";
import StrictEventEmitter from "strict-event-emitter-types";

export type Data = { [key: string]: any };

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

  rx(data: { [key: string]: any }) {
    this.emit("rx", data);
  }

  tx(data: { [key: string]: any }) {
    this.emit("tx", data);
  }

  debug() {
    this.on("rx", data => console.log(`[${this.port_name}] RX: ${data}`));
    this.on("tx", data => console.log(`[${this.port_name}] TX: ${data}`));
  }
}