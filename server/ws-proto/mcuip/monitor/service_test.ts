import { expect, test } from "bun:test";
import { MonitorService } from "./service";
import { MonitorManager } from "./manager";
import { GlobalState } from "../global_state";
import { TestJSONRootRouter } from "../../json_router/test";
import { Data } from "./node";

const port1_name = "COM1";
const port2_name = "COM2";

const test_data_p1p2: Data = {
  "c": "0",
  "d": { m: "Hello from port1" }
}

const test_data_p2p1: Data = {
  "c": "1",
  "d": { m: "Hello from port2" }
}

function getRouter() {
  const router = new TestJSONRootRouter("service");
  const serial_manager = GlobalState.getInstance().monitor_manager;
  const monitor_service = new MonitorService(router, serial_manager);

  return { router, monitor_service };
}


test("New command test", () => {
  GlobalState.getInstance().reset();
  const router = new TestJSONRootRouter("service");
  const serial_manager = new MonitorManager();
  const monitor_service = new MonitorService(router, serial_manager);

  monitor_service.newDevice(port1_name);

  const port = serial_manager.getMonitor(port1_name);
  expect(port).toBeDefined();
});

test("Connect command test", () => {
  GlobalState.getInstance().reset();
  const { monitor_service } = getRouter();

  monitor_service.newDevice(port1_name);
  monitor_service.newDevice(port2_name);
  monitor_service.connect(port1_name, port2_name);
});


test("tx(+connect) command test", () => {
  GlobalState.getInstance().reset();
  const { router, monitor_service } = getRouter();
  monitor_service.newDevice(port1_name);
  monitor_service.newDevice(port2_name);
  monitor_service.connect(port1_name, port2_name);

  let cache_data_port2 = {
    "c": "0",
    "d": { m: "-----" }
  };
  let cache_data_port1 = {
    "c": "0",
    "d": { m: "-----" }
  };
  monitor_service.onRx(port2_name, data => {
    cache_data_port2 = data as any;
  });
  monitor_service.onRx(port1_name, data => {
    cache_data_port1 = data as any;
  });

  monitor_service.tx(port1_name, test_data_p1p2);
  expect(cache_data_port2).toEqual(test_data_p1p2);

  monitor_service.tx(port2_name, test_data_p2p1);
  expect(cache_data_port1).toEqual(test_data_p2p1);
});


test("TX Separated test", () => {
  GlobalState.getInstance().reset();
  const { router: router1, monitor_service: monitor_service1 } = getRouter();
  monitor_service1.newDevice(port1_name);

  const { router: router2, monitor_service: monitor_service2 } = getRouter();
  monitor_service2.newDevice(port2_name);
  monitor_service2.connect(port2_name, port1_name);

  const { router: router3 } = getRouter();

  monitor_service1.tx(port1_name, test_data_p1p2);


  expect(router1.data).toEqual({});
  expect(router2.data).toEqual({
    "service": "monitor",
    "command": "rx",
    "port_name": port2_name,
    "rx_data": test_data_p1p2
  });
  expect(router3.data).toEqual({});

  router2.data = {};

  monitor_service2.tx(port2_name, test_data_p2p1);
  expect(router1.data).toEqual({
    "service": "monitor",
    "command": "rx",
    "port_name": port1_name,
    "rx_data": test_data_p2p1
  });
  expect(router2.data).toEqual({});
  expect(router3.data).toEqual({});
});
