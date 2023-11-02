import { expect, test } from "bun:test";
import { Device, Flash } from "./device";

test("Device flash callback", async () => {

  let cb_called = false;
  const cb = async (_flash: Flash) => {
    cb_called = true;
  }

  const device = new Device("Test device");
  device.add_flash_callback(cb);

  device.flash({
    data_base64: "",
    tag: "Test flash"
  });

  expect(cb_called).toBe(true);

})