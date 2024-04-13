import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";

type ControlValueType = "num" | "bool";

type ControlSubType<T extends ControlValueType> = T extends "num"
  ? ("value" | "joystick" | "pid")
  : ("button" | "action");

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
      "smx": { prev: NaN, curr: 0, range: [-100, 100] },
      "smy": { prev: NaN, curr: 0, range: [-100, 100] },
      "lha": { prev: NaN, curr: 0, range: [-100, 100] },
      "lva": { prev: NaN, curr: 0, range: [-100, 100] },
      "msp": { prev: NaN, curr: 0, range: [0, 1] },
      "mea": { prev: NaN, curr: 0, range: [0, 1] },
      "sm0pp": { prev: NaN, curr: 1, range: [0, 10] },
      "sm0pi": { prev: NaN, curr: 0, range: [0, 10] },
      "sm0pd": { prev: NaN, curr: 0, range: [0, 10] },
      "sm1pp": { prev: NaN, curr: 1, range: [0, 10] },
      "sm1pi": { prev: NaN, curr: 0, range: [0, 10] },
      "sm1pd": { prev: NaN, curr: 0, range: [0, 10] },
      "sm2pp": { prev: NaN, curr: 1, range: [0, 10] },
      "sm2pi": { prev: NaN, curr: 0, range: [0, 10] },
      "sm2pd": { prev: NaN, curr: 0, range: [0, 10] },
      "sgpp": { prev: NaN, curr: 1, range: [0, 10] },
      "sgpi": { prev: NaN, curr: 0, range: [0, 10] },
      "sgpd": { prev: NaN, curr: 0, range: [0, 10] },
      "sm0d": { prev: NaN, curr: 0.25, range: [0, 1] },
      "sm1d": { prev: NaN, curr: 0.25, range: [0, 1] },
      "sm2d": { prev: NaN, curr: 0.25, range: [0, 1] },
      "uepp": { prev: NaN, curr: 1, range: [0, 1] },
      "uepi": { prev: NaN, curr: 0, range: [0, 1] },
      "uepd": { prev: NaN, curr: 0, range: [0, 1] },
      "urpp": { prev: NaN, curr: 1, range: [0, 1] },
      "urpi": { prev: NaN, curr: 0, range: [0, 1] },
      "urpd": { prev: NaN, curr: 0, range: [0, 1] },
    },
    bool: {
      "srp": { prev: true, curr: true },
      "sht": { prev: false, curr: false },
      "srr": { prev: false, curr: false },
      "srl": { prev: false, curr: false },
      "urc": { prev: false, curr: false },
      "s0i": { prev: false, curr: false },
      "s1i": { prev: false, curr: false },
      "s2i": { prev: false, curr: false },
      "emc": { prev: false, curr: false },
    },
  };

  public devices: {
    last_ping: Writable<number>;
    status: Writable<number>;
  }[] = [
      { last_ping: writable(0), status: writable(-1) },
      { last_ping: writable(0), status: writable(-1) },
    ];

  public packet_types: PacketType[] = [
    { id: 0x01, type: "bool", subtype: "button", target: ["srp"], counter: 0 },
    { id: 0x02, type: "bool", subtype: "button", target: ["sht"], counter: 0 },
    { id: 0x03, type: "bool", subtype: "button", target: ["emc"], counter: 0 },
    { id: 0x00, type: "bool", subtype: "action", target: ["srr"], counter: 0 },
    { id: 0x01, type: "bool", subtype: "action", target: ["srl"], counter: 0 },
    { id: 0x02, type: "bool", subtype: "action", target: ["urc"], counter: 0 },
    { id: 0x03, type: "bool", subtype: "action", target: ["s0i"], counter: 0 },
    { id: 0x04, type: "bool", subtype: "action", target: ["s1i"], counter: 0 },
    { id: 0x05, type: "bool", subtype: "action", target: ["s2i"], counter: 0 },
    { id: 0x00, type: "num", subtype: "joystick", target: ["smx", "smy"], counter: 0 },
    { id: 0x02, type: "num", subtype: "joystick", target: ["lha", "lva"], counter: 0 },
    { id: 0x00, type: "num", subtype: "pid", target: ["sm0pp", "sm0pi", "sm0pd"], counter: 0 },
    { id: 0x01, type: "num", subtype: "pid", target: ["sm1pp", "sm1pi", "sm1pd"], counter: 0 },
    { id: 0x02, type: "num", subtype: "pid", target: ["sm2pp", "sm2pi", "sm2pd"], counter: 0 },
    { id: 0x03, type: "num", subtype: "pid", target: ["sgpp", "sgpi", "sgpd"], counter: 0 },
    { id: 0x04, type: "num", subtype: "pid", target: ["uepp", "uepi", "uepd"], counter: 0 },
    { id: 0x05, type: "num", subtype: "pid", target: ["urpp", "urpi", "urpd"], counter: 0 },
    { id: 0x00, type: "num", subtype: "value", target: ["msp"], counter: 0 },
    { id: 0x01, type: "num", subtype: "value", target: ["mea"], counter: 0 },
    { id: 0x02, type: "num", subtype: "value", target: ["sm0d"], counter: 0 },
    { id: 0x03, type: "num", subtype: "value", target: ["sm1d"], counter: 0 },
    { id: 0x04, type: "num", subtype: "value", target: ["sm2d"], counter: 0 },
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
        this.devices[id].last_ping.set(now);
        return;
      } else if (opcode == 0xf0) {
        const id = view.getUint16(1);
        const status = view.getUint8(3);
        this.devices[id].status.set(status);
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
    console.log(
      [...new Uint8Array(data)].map(x => x.toString(16)).join(" ")
    )
    const sock = get(this.sock);
    if (!sock) return;
    sock.send(data);
  }


  update_sub_controls() {
    /* const x = this.controls.num["srx"].curr;
    const y = this.controls.num["sry"].curr;

    this.controls.num["srm"].curr = Math.sqrt(x * x + y * y);
    this.controls.num["sra"].curr = (Math.atan2(y, x) * 180.0) / Math.PI + 90.0;
    if (x == 0 && y == 0) this.controls.num["sra"].curr = 0.0;

    if (this.controls.num["sra"].curr < 0) this.controls.num["sra"].curr += 360.0; */
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
    } else if (packet.type === "bool" && packet.subtype === "action") {
      const control_group = this.controls[packet.type];
      const controls = packet.target.map(t => control_group[t]);

      controls.forEach((c) => {
        c.prev = c.curr;
      });

      const buf = new ArrayBuffer(1);
      const view = new DataView(buf);
      view.setUint8(0, packet.id | 0x80);

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
      view.setUint8(0, 0x60 | packet.id);
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
    return getContext<App>("2023korobonc");
  }
}