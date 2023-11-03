import { Device } from "./device";

export class DeviceManager {
  private devices: { [key: string]: Device } = {}

  constructor() { }

  private check_device_name(name: string) {
    if (this.devices[name]) {
      throw new Error(`Device ${name} already exists`);
    }
  }

  newDevice(name: string): Device {
    this.check_device_name(name);

    const device = new Device(name);
    this.devices[name] = device;

    return device;
  }

  getDevice(name: string): Device | undefined {
    return this.devices[name];
  }

  getDevices() {
    return Object.values(this.devices);
  }

  getDeviceNames() {
    return Object.keys(this.devices);
  }
}