import { JSONEndpoint, JSONRouter } from "../../json_router";
import { JSONObject } from "../../json_router/types";
import { McuIpService } from "../service_base";
import { Flash } from "./device";
import { NodeManager } from "./manager";

export class FlashService extends McuIpService<{
  command: string
}> {
  public point_new: JSONEndpoint<{ device_name: string }>;
  public point_subscribe: JSONEndpoint<{ device_name: string }>;
  public point_flash: JSONEndpoint<{ flash: Flash, device_name: string }>;

  constructor(backref: JSONRouter<any>, private node_manager: NodeManager) {
    super("flash", backref);

    const self = this;
    this.point_new = this.endpoint("new", data => {
      const device_name = data.device_name;
      if (typeof device_name !== 'string') {
        throw new Error("device_name is not a string");
      }

      self.node_manager.newDevice(device_name);
    });

    this.point_subscribe = this.endpoint("subscribe", data => {
      const device_name = data.device_name;
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
      const { flash, device_name } = data;
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

  public newDevice(device_name: string) {
    this.point_new.route({
      device_name
    });
  }

  public flash(flash: Flash, device_name: string) {
    this.point_flash.route({
      flash,
      device_name
    });
  }

  public subscribe(device_name: string) {
    this.point_subscribe.route({
      device_name
    });
  }

  public getLocalDevice(device_name: string) {
    return this.node_manager.getDevice(device_name);
  }
}