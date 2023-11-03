import { NodeManager } from "./flash/manager";
import { MonitorManager } from "./monitor/manager";

export class GlobalState {
  static instance: GlobalState;
  static getInstance(): GlobalState {
    if (!GlobalState.instance) {
      GlobalState.instance = new GlobalState();
    }
    return GlobalState.instance;
  }

  monitor_manager: MonitorManager;
  node_manager: NodeManager;

  constructor() {
    this.monitor_manager = new MonitorManager();
    this.node_manager = new NodeManager();
  }

  reset() {
    this.monitor_manager = new MonitorManager();
    this.node_manager = new NodeManager();
  }
}