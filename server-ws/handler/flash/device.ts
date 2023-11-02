export type Flash = {
  tag: string,
  data_base64: string
};

type FlashCallback = (flash: Flash) => Promise<void>;

export class Device {
  private in_flashing: boolean = false;
  private flash_callback: FlashCallback[] = [];

  constructor(public name: string) { }

  public add_flash_callback(callback: FlashCallback) {
    this.flash_callback.push(callback);
  }

  public async flash(flash: Flash) {
    if (this.in_flashing) {
      throw new Error("Already in flashing");
    }

    this.in_flashing = true;
    try {
      await Promise.all(this.flash_callback.map(callback => callback(flash)));
    } finally {
      this.in_flashing = false;
    }
  }
}
