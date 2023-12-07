import { JSONEndpoint, JSONRouter } from "../../json_router";
import { McuIpService } from "../service_base";
import { Flash } from "./device";
import { NodeManager } from "./manager";

export class FlashService extends McuIpService {
  public point_new: JSONEndpoint;
  public point_subscribe: JSONEndpoint;
  public point_flash: JSONEndpoint;

  constructor(backref: JSONRouter, private node_manager: NodeManager) {
    super("flash", backref);

    const self = this;
    this.point_new = this.endpoint("new", data => {
      const { device_name } = data as { [key: string]: any };
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }

      self.node_manager.newDevice(device_name);
    });

    this.point_subscribe = this.endpoint("subscribe", data => {
      const { device_name } = data as { [key: string]: any };
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }

      const device = self.node_manager.getDevice(device_name);
      if (!device) {
        throw new Error(`Device ${device_name} not found`);
      }

      device.on("flash", flash => {
        self.point_flash.back_routing({
          device_name,
          flash
        });
      });
    });

    this.point_flash = this.endpoint("flash", data => {
      const { flash, device_name } = data as { flash: Flash, device_name: string };
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }
      if (typeof flash !== 'object') {
        throw new Error("flash is not an object");
      }

      const device = self.node_manager.getDevice(device_name);
      if (!device) {
        throw new Error(`Device ${device_name} not found`);
      }

      device.flash(flash);
    });
  }
}