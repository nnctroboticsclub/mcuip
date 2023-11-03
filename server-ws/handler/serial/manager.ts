import { SerialPort } from "./port";


export class SerialPortManager {
  serial_ports: SerialPort[];

  constructor() {
    this.serial_ports = [];
  }

  port(name: string): SerialPort {
    const new_port = new SerialPort(name);

    this.serial_ports.push(new_port);

    return new_port;
  }

  connect(port1: SerialPort, port2: SerialPort) {
    port1.on("tx", data => port2.rx(data));
    port2.on("tx", data => port1.rx(data));
  }

  get_port(name: string): SerialPort | undefined {
    for (let port of this.serial_ports) {
      if (port.name === name) {
        return port;
      }
    }

    return undefined;
  }
}