import { DeviceManager } from "./flash/device_manager";
import { SerialPortManager } from "./serial/manager";

export class GlobalState {
  static instance: GlobalState;
  static getInstance(): GlobalState {
    if (!GlobalState.instance) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  serial_manager: SerialPortManager;
  device_manager: DeviceManager;

  constructor() {
    this.serial_manager = new SerialPortManager();
    this.device_manager = new DeviceManager();
  }

  reset() {
    this.serial_manager = new SerialPortManager();
    this.device_manager = new DeviceManager();
  }
}