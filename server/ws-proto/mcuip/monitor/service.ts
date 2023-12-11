import { JSONEndpoint, JSONRouter } from "../../json_router";
import { McuIpService } from "../service_base";
import { MonitorManager } from "./manager";
import { Data } from "./node";

export class MonitorService extends McuIpService<{
  command: string
}> {
  // incoming commands
  public point_new: JSONEndpoint<{ port_name: string }>;
  public point_tx: JSONEndpoint<{ port_name: string, tx_data: Data }>;
  public point_connect: JSONEndpoint<{ port_name_A: string, port_name_B: string }>;

  // outgoing commands
  public point_rx: JSONEndpoint<{ port_name: string, rx_data: Data }>;

  constructor(backref: JSONRouter<any>, private serial_manager: MonitorManager) {
    super("monitor", backref);


    let self = this;
    this.point_new = this.endpoint("new", data => {
      const port_name = data.port_name;
      if (typeof port_name !== 'string') {
        throw new Error("port_name is not a string");
      }

      const port = self.serial_manager.createMonitor(port_name);

      port.on("rx", data => {
        self.point_rx.back_routing({
          "port_name": port_name,
          "rx_data": data
        });
      });
    });

    this.point_tx = this.endpoint("tx", data => {
      const { port_name, tx_data } = data;

      if (typeof port_name !== 'string') {
        throw new Error("port_name is not a string");
      }

      if (typeof tx_data.c !== 'string') {
        throw new Error("tx_data.c is not a string");
      }

      if (typeof tx_data.d !== 'object') {
        throw new Error("tx_data.d is not an object");
      }

      const port = self.serial_manager.getMonitor(port_name);
      if (!port) {
        throw new Error(`Port ${port_name} not found`);
      }

      port.tx(tx_data);
    });

    this.point_connect = this.endpoint("connect", data => {
      const { port_name_A, port_name_B } = data;

      if (typeof port_name_A !== 'string') {
        throw new Error("port_name_A is not a string");
      }

      if (typeof port_name_B !== 'string') {
        throw new Error("port_name_B is not a string");
      }

      const portA = self.serial_manager.getMonitor(port_name_A);
      const portB = self.serial_manager.getMonitor(port_name_B);

      if (!portA) {
        throw new Error(`Port ${port_name_A} not found`);
      }

      if (!portB) {
        throw new Error(`Port ${port_name_B} not found`);
      }

      self.serial_manager.connect(portA, portB);
    });

    this.point_rx = this.endpoint("rx", _ => { });
  }

  newDevice(port_name: string) {
    this.point_new.route({ port_name });
  }

  tx(port_name: string, tx_data: Data) {
    this.point_tx.route({ port_name, tx_data });
  }

  connect(port_name_A: string, port_name_B: string) {
    this.point_connect.route({ port_name_A, port_name_B });
  }

  onRx(port_name: string, callback: (data: Data) => void) {
    this.serial_manager.getMonitor(port_name)?.on("rx", callback);
  }
}