import { McuIpClient } from ".";

export class VirtualFlashDevice {
  client: McuIpClient;

  constructor(server_url: string, private device_name: string) {
    this.client = new McuIpClient(server_url);

    this.client.flashCreateDevice(this.device_name);
    this.client.flashSubscribe(this.device_name);

    this.client.addMessageHandler(`vFlash ${device_name}`, (data) => {
      console.log(data);
      return true;
    });
  }
}