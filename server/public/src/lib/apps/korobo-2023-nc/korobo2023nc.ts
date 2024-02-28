import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";

type ControlValueType = "num" | "bool";

type ControlSubType<T extends ControlValueType> = T extends "num"
  ? ("value" | "joystick" | "pid")
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
  public url: string = `ws://${globalThis?.location?.hostname ?? "localhost"}:8000/client`;
  public sock: Writable<WebSocket | undefined> = writable();

  private data_handler: {
    [opcode: number]: ((data: DataView) => void)[];
  } = {};

  public controls: Controls = {
    num: {
      "smx": { prev: 0, curr: 0, range: [-100, 100] },
      "smy": { prev: 0, curr: 0, range: [-100, 100] },
      "srx": { prev: 0, curr: 0, range: [-100, 100] },
      "sry": { prev: 0, curr: 0, range: [-100, 100] },
      "srm": { prev: 0, curr: 0, range: [0, 100] },
      "sra": { prev: 0, curr: 0, range: [0, 360] },
      "lha": { prev: 0, curr: 0, range: [-100, 100] },
      "lva": { prev: 0, curr: 0, range: [-100, 100] },
      "msp": { prev: 0, curr: 0, range: [0, 1] },
      "mea": { prev: 0, curr: 0, range: [0, 1] },
      "sm0pp": { prev: 0, curr: 2.7, range: [0, 10] },
      "sm0pi": { prev: 0, curr: 0, range: [0, 10] },
      "sm0pd": { prev: 0, curr: 0.000015, range: [0, 10] },
      "sm1pp": { prev: 0, curr: 2.7, range: [0, 10] },
      "sm1pi": { prev: 0, curr: 0, range: [0, 10] },
      "sm1pd": { prev: 0, curr: 0.000015, range: [0, 10] },
      "sm2pp": { prev: 0, curr: 2.7, range: [0, 10] },
      "sm2pi": { prev: 0, curr: 0, range: [0, 10] },
      "sm2pd": { prev: 0, curr: 0.000015, range: [0, 10] },
      "sgpp": { prev: 0, curr: 2.7, range: [0, 10] },
      "sgpi": { prev: 0, curr: 0, range: [0, 10] },
      "sgpd": { prev: 0, curr: 0.000015, range: [0, 10] },
    },
    bool: {
      "srp": { prev: true, curr: true },
      "sht": { prev: false, curr: false }
    }
  };

  public last_ping: Writable<number>[] = [
    writable(0), writable(0)
  ];

  public packet_types: PacketType[] = [
    { id: 0x00, subtype: "joystick", type: "num", target: ["smx", "smy"], counter: 0 },
    { id: 0x01, subtype: "joystick", type: "num", target: ["srm", "sra"], counter: 0 },
    { id: 0x02, subtype: "joystick", type: "num", target: ["lha", "lva"], counter: 0 },
    { id: 0x01, subtype: "button", type: "bool", target: ["srp"], counter: 0 },
    { id: 0x00, subtype: "pid", type: "num", target: ["sm0pp", "sm0pi", "sm0pd"], counter: 0 },
    { id: 0x01, subtype: "pid", type: "num", target: ["sm1pp", "sm1pi", "sm1pd"], counter: 0 },
    { id: 0x02, subtype: "pid", type: "num", target: ["sm2pp", "sm2pi", "sm2pd"], counter: 0 },
    { id: 0x03, subtype: "pid", type: "num", target: ["sgpp", "sgpi", "sgpd"], counter: 0 },
    { id: 0x00, subtype: "value", type: "num", target: ["msp"], counter: 0 },
    { id: 0x01, subtype: "value", type: "num", target: ["mea"], counter: 0 },
    { id: 0x02, subtype: "button", type: "bool", target: ["sht"], counter: 0 },
  ];

  async connect() {
    const sock = new WebSocket(this.url);

    sock.onmessage = async (e) => {
      if (!(e.data instanceof Blob)) {
        console.log("Received non-blob data");
        return;
      }

      const data = await e.data.arrayBuffer();
      const view = new DataView(data);

      const opcode = view.getUint8(0);

      if (opcode == 0xff) // pong notify
      {
        const now = Date.now() / 1000;
        const id = view.getUint8(1);
        this.last_ping[id].set(now);
        return;
      }

      if (!(opcode in this.data_handler)) {
        console.log("?<==" + [...new Uint8Array(data)].map(x => x.toString(16)).join(" "));
        return;
      }

      const handlers = this.data_handler[opcode];

      const data_ = new DataView(data, 1);

      handlers.forEach((handler) => {
        handler(data_)
      });


    };

    sock.onerror = (e) => {
      console.log(e);
      this.sock.set(undefined);
    };

    sock.onclose = (e) => {
      console.log("Disconnected");
      this.sock.set(undefined);
    };

    await new Promise((resolve) => {
      sock.onopen = () => {
        console.log("Connected");
        resolve(null);
      };
    });

    this.sock.set(sock);
  }

  on_data(opcode: number, handler: (data: DataView) => void) {
    if (!(opcode in this.data_handler)) this.data_handler[opcode] = [];
    this.data_handler[opcode].push(handler);
  }

  send_ctrl_packet(data: ArrayBuffer) {
    const sock = get(this.sock);
    if (!sock) return;

    sock.send(data);
  }


  update_sub_controls() {
    const x = this.controls.num["srx"].curr;
    const y = this.controls.num["sry"].curr;

    this.controls.num["srm"].curr = Math.sqrt(x * x + y * y);
    this.controls.num["sra"].curr = (Math.atan2(y, x) * 180.0) / Math.PI + 90.0;
    if (x == 0 && y == 0) this.controls.num["sra"].curr = 0.0;

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
    } else if (packet.type === "num" && packet.subtype === "pid") {
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

      const buf = new ArrayBuffer(4);
      const view = new DataView(buf);
      view.setUint8(0, 0xA0 | packet.id);
      view.setUint8(1, array[0]);
      view.setUint8(2, array[1]);
      view.setUint8(3, array[2]);

      this.send_ctrl_packet(buf);
    } else if (packet.type === "num" && packet.subtype === "value") {
      const control_group = this.controls[packet.type];
      const controls = packet.target.map(t => control_group[t]);

      controls.forEach((c) => {
        c.prev = c.curr;
      });

      const array = (controls as Control<"num">[]).
        map(control => Math.round(
          ((control.curr - control.range[0]) /
            (control.range[1] - control.range[0])) *
          65536.0
        ));

      const buf = new ArrayBuffer(3);
      const view = new DataView(buf);
      view.setUint8(0, 0x00 | packet.id);
      view.setUint8(1, array[0] >> 0x08);
      view.setUint8(2, array[0] & 0xff);

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