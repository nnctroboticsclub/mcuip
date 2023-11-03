import { EventEmitter } from "stream";
import { StrictEventEmitter } from "strict-event-emitter-types";


export type Flash = {
  tag: string,
  data_base64: string
};

type FlashCallback = (flash: Flash) => Promise<void>;

interface Events {
  flash: Flash
};

type DeviceEvents = StrictEventEmitter<EventEmitter, Events>;

export class Device extends (EventEmitter as { new(): DeviceEvents }) {
  private in_flashing: boolean = false;

  constructor(public name: string) {
    super()
  }

  public async flash(flash: Flash) {
    if (this.in_flashing) {
      throw new Error("Already in flashing");
    }

    this.in_flashing = true;

    try {
      this.emit("flash", flash);
    } finally {
      this.in_flashing = false;
    }
  }
}
