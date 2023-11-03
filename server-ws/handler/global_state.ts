import { NodeManager } from "./flash/node_manager";
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
  node_manager: NodeManager;

  constructor() {
    this.serial_manager = new SerialPortManager();
    this.node_manager = new NodeManager();
  }

  reset() {
    this.serial_manager = new SerialPortManager();
    this.node_manager = new NodeManager();
  }
}