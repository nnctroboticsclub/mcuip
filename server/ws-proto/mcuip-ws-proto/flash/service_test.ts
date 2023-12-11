import { expect, test } from "bun:test";
import { GlobalState } from "../global_state";
import { FlashService } from "./service";
import { TestJSONRootRouter } from "../../json_router/test";

function getRouter() {
  const router = new TestJSONRootRouter("service");
  const node_manager = GlobalState.getInstance().node_manager;
  const flash_service = new FlashService(router, node_manager);

  return { router, flash_service };
}

const device_name = "device1";

const flash = {
  "tag": "Flash",
  "data_base64": "===="
};

const flash_res = {
  "service": "flash",
  "command": "flash",
  "device_name": device_name,
  "flash": flash
};

test("Node creation test", () => {
  GlobalState.getInstance().reset();
  const { flash_service } = getRouter();
  flash_service.newDevice(device_name);

  const device = GlobalState.getInstance().node_manager.getDevice(device_name);
  expect(device).toBeDefined();
});

test("Node flashing test", () => {
  GlobalState.getInstance().reset();
  const { flash_service } = getRouter();
  flash_service.newDevice(device_name);
  flash_service.flash(flash, device_name);
});

test("Node subscription test (single router)", () => {
  GlobalState.getInstance().reset();
  const { router, flash_service } = getRouter();
  flash_service.newDevice(device_name);
  flash_service.subscribe(device_name);
  flash_service.flash(flash, device_name);

  expect(router.data).toEqual(flash_res)
});

test("Node subscription test (different router)", () => {
  GlobalState.getInstance().reset();
  const { flash_service: flash1 } = getRouter();
  const { flash_service: flash2, router: router2 } = getRouter();
  flash1.newDevice(device_name);
  flash2.subscribe(device_name);
  flash1.flash(flash, device_name);

  expect(router2.data).toEqual(flash_res)
});

test("Node subscription test (avoid excess message)", () => {
  GlobalState.getInstance().reset();
  const { flash_service: flash1 } = getRouter();
  const { flash_service: flash2 } = getRouter();
  const { router: router3 } = getRouter();
  flash1.newDevice(device_name);
  flash2.subscribe(device_name);
  flash1.flash(flash, device_name);

  expect(router3.data).toEqual({});
});

