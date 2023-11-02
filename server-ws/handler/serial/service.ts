import { JSONEndpoint, JSONRouter } from "../../json_router";
import { McuIpService } from "../service_base";
import { SerialPortManager } from "./manager";

export class SerialService extends McuIpService {
  serial_manager: SerialPortManager;

  // incoming commands
  point_new: JSONEndpoint;
  point_tx: JSONEndpoint;
  point_connect: JSONEndpoint;

  // outgoing commands
  point_rx: JSONEndpoint;

  constructor(backref: JSONRouter) {
    super("serial", backref);
    this.serial_manager = new SerialPortManager();


    let self = this;
    this.point_new = this.endpoint("new", data => {
      const { port_name } = data as { [key: string]: any };
      if (typeof port_name !== 'string') {
        throw new Error("port_name is not a string");
      }

      self.serial_manager.port(port_name);
    });

    this.point_tx = this.endpoint("tx", data => {
      const { port_name } = data as { [key: string]: any };
      if (typeof port_name !== 'string') {
        throw new Error("port_name is not a string");
      }

      const port = self.serial_manager.get_port(port_name);
      if (!port) {
        throw new Error(`Port ${port_name} not found`);
      }

      const { data: string } = data as { [key: string]: any };
      port.tx(data);
    });

    this.point_connect = this.endpoint("connect", data => {
      const { port_name_A } = data as { [key: string]: any };
      if (typeof port_name_A !== 'string') {
        throw new Error("port_name_A is not a string");
      }

      const { port_name_B } = data as { [key: string]: any };
      if (typeof port_name_B !== 'string') {
        throw new Error("port_name_B is not a string");
      }

      const portA = self.serial_manager.get_port(port_name_A);
      if (!portA) {
        throw new Error(`Port ${port_name_A} not found`);
      }

      const portB = self.serial_manager.get_port(port_name_B);
      if (!portB) {
        throw new Error(`Port ${port_name_B} not found`);
      }

      self.serial_manager.connect(portA, portB);
    });

    this.point_rx = this.endpoint("rx", _ => { });
  }
}