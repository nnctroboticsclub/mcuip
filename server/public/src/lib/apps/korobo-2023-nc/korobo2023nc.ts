import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";

type ControlValueType = "num" | "bool";

type ControlSubType<T extends ControlValueType> = T extends "num"
  ? ("value" | "joystick")
  : "button";
type ControlValue<T extends ControlValueType> = T extends "num" ? number : boolean;

type Control<T extends ControlValueType> = {
  prev: ControlValue<T>;
  curr: ControlValue<T>;
} & (T extends "bool" ? {} : { range: [number, number] })

type Controls = {
  [T in ControlValueType]: { [key: string]: Control<T> };
};

type PacketType = {
  id: number;
  subtype: ControlSubType<ControlValueType>;
  type: ControlValueType;
  target: string[];
  counter: number;
};

export class App {
  public url: string = "ws://192.168.137.247/robo-ctrl";
  public sock: Writable<WebSocket | undefined> = writable();

  public controls: Controls = {
    num: {
      "smx": { prev: 0, curr: 0, range: [-100, 100] },
      "smy": { prev: 0, curr: 0, range: [-100, 100] },
      "srx": { prev: 0, curr: 0, range: [-100, 100] },
      "sry": { prev: 0, curr: 0, range: [-100, 100] },
      "srm": { prev: 0, curr: 0, range: [0, 100] },
      "sra": { prev: 0, curr: 0, range: [0, 360] },
    },
    bool: {
      "srp": { prev: true, curr: true }
    }
  };

  private packet_types: PacketType[] = [
    { id: 0x00, subtype: "joystick", type: "num", target: ["smx", "smy"], counter: 0 },
    { id: 0x01, subtype: "joystick", type: "num", target: ["srm", "sra"], counter: 0 },
    { id: 0x01, subtype: "button", type: "bool", target: ["srp"], counter: 0 },
  ];

  async connect() {
    const sock = new WebSocket(this.url);

    sock.onmessage = (e) => {
      console.log(e.data);
    };

    sock.onerror = (e) => {
      console.log(e);
      this.sock.set(undefined);
    };

    sock.onclose = (e) => {
      console.log(e);
      this.sock.set(undefined);
    };

    await new Promise((resolve) => {
      sock.onopen = () => {
        resolve(null);
      };
    });

    this.sock.set(sock);
  }

  send_ctrl_packet(data: ArrayBuffer) {
    const sock = get(this.sock);
    if (!sock) return;

    sock.send(data);
    console.log([...new Uint8Array(data)].map(x => x.toString(16)).join(" "));
  }


  update_sub_controls() {
    const x = this.controls.num["srx"].curr;
    const y = this.controls.num["sry"].curr;

    this.controls.num["srm"].curr = Math.sqrt(x * x + y * y);
    this.controls.num["sra"].curr = (Math.atan2(y, x) * 180.0) / Math.PI + 90.0;
    if (this.controls.num["sra"].curr < 0) this.controls.num["sra"].curr += 360.0;
  }

  detect_changed_packet() {
    const packet_candidates = this.packet_types
      .filter((pkt) => pkt.target.
        map(t => this.controls[pkt.type][t]).
        some(x => x.curr != x.prev)
      )
      .sort((a, b) => b.counter - a.counter);

    if (packet_candidates.length == 0) return undefined;

    return packet_candidates[0];
  }

  send_changed_packet1() {
    if (!this.sock) return;

    const packet = this.detect_changed_packet();

    if (!packet) return;

    this.packet_types.forEach((pkt) => {
      if (pkt.id == packet.id) pkt.counter = 0;
      else pkt.counter++;
    });

    if (packet.type === "num" && packet.subtype === "joystick") {
      const control_group = this.controls[packet.type];
      const controls = packet.target.map(t => control_group[t]);

      controls.forEach((c) => {
        c.prev = c.curr;
      });

      const array = (controls as Control<"num">[]).
        map(control => Math.round(
          ((control.curr - control.range[0]) /
            (control.range[1] - control.range[0])) *
          255.0
        ));

      const buf = new ArrayBuffer(3);
      const view = new DataView(buf);
      view.setUint8(0, 0x40 | packet.id);
      view.setUint8(1, array[0]);
      view.setUint8(2, array[1]);

      this.send_ctrl_packet(buf);
    } else if (packet.type === "bool" && packet.subtype === "button") {
      const control_group = this.controls[packet.type];
      const controls = packet.target.map(t => control_group[t]);

      controls.forEach((c) => {
        c.prev = c.curr;
      });

      const buf = new ArrayBuffer(1);
      const view = new DataView(buf);
      view.setUint8(0, packet.id | (controls[0].curr ? 0x20 : 0x00));

      this.send_ctrl_packet(buf);
    }
  }

  public tick() {
    this.update_sub_controls();
    this.send_changed_packet1();
  }

  public static new_instance() {
    const app = new App();
    setContext("2023korobonc", app)
    return app;
  }

  public static get_instance() {
    return getContext("2023korobonc");
  }
}