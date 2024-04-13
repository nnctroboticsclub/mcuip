import { Emitter } from "strict-event-emitter";

export type Flash = {
  tag: string,
  data_base64: string
};

type Events = {
  flash: [Flash]
};

export class Device extends Emitter<Events> {
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
