import { expect, test } from "bun:test";
import { NodeManager } from "./node_manager";

test("Register", () => {
  const manager = new NodeManager();

  const device = manager.newDevice("Test device");

  expect(device.name).toBe("Test device");
});

test("Register (duplicated)", () => {
  const manager = new NodeManager();

  manager.newDevice("Test device");

  try {
    manager.newDevice("Test device");
    expect(true).toBe(false);
  } catch (e) {
    if (e instanceof Error) {
      expect(e.message).toBe("Device Test device already exists");
    }
  }
});

test("GetDevice", () => {
  const manager = new NodeManager();

  const device = manager.newDevice("Test device");

  expect(manager.getDevice("Test device")).toBe(device);
});

test("GetDevice (not found)", () => {
  const manager = new NodeManager();

  expect(manager.getDevice("Test device")).toBe(undefined);
});

test("GetDevices", () => {
  const manager = new NodeManager();

  const device = manager.newDevice("Test device1");
  const device2 = manager.newDevice("Test device2");

  expect(manager.getDevices()).toEqual([device, device2]);
});
test("GetDeviceNames", () => {
  const manager = new NodeManager();

  const device = manager.newDevice("Test device1");
  const device2 = manager.newDevice("Test device2");

  expect(manager.getDeviceNames()).toEqual(["Test device1", "Test device2"]);
});