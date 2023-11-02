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

  constructor() {
    this.serial_manager = new SerialPortManager();
  }
}