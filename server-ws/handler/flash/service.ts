import { JSONEndpoint, JSONRouter } from "../../json_router";
import { McuIpService } from "../service_base";
import { Flash } from "./device";
import { DeviceManager } from "./device_manager";

export class FlashService extends McuIpService {
  point_new: JSONEndpoint;
  point_flash: JSONEndpoint;

  constructor(backref: JSONRouter, private device_manager: DeviceManager) {
    super("flash", backref);

    const self = this;
    this.point_new = this.endpoint("new", data => {
      const { device_name } = data as { [key: string]: any };
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }

      self.device_manager.newDevice(device_name);
    });

    this.point_flash = this.endpoint("flash", data => {
      const { flash, device_name } = data as { flash: Flash, device_name: string };
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }
      if (typeof flash !== 'object') {
        throw new Error("flash is not an object");
      }

      const device = self.device_manager.getDevice(device_name);
      if (!device) {
        throw new Error(`Device ${device_name} not found`);
      }

      device.flash(flash);
    });
  }
}