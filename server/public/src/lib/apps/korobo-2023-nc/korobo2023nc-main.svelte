<script lang="ts">
  import Joystick from "$lib/ui/joystick.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import { getWindow } from "$lib/window/window";
  import { get } from "svelte/store";
  import Toggle from "$lib/ui/toggle.svelte";
  import { console_texts } from "$lib/console_patch";
  import SrAbe2 from "./sr-abe-2.png";

  const url_store = getWindow().getDataStore<string>("url");
  const sock_store = getWindow().getDataStore<WebSocket | undefined>("socket");

  if (!$url_store) {
    url_store.set("ws://192.168.137.206/robo-ctrl");
  }

  async function connect() {
    const sock = new WebSocket(get(url_store));

    sock.onmessage = (e) => {
      console.log(e.data);
    };

    sock.onerror = (e) => {
      console.log(e);
      sock_store.set(undefined);
    };

    sock.onclose = (e) => {
      console.log(e);
      sock_store.set(undefined);
    };

    await new Promise((resolve) => {
      sock.onopen = () => {
        resolve(null);
      };
    });

    sock_store.set(sock);
  }

  // counter: higher = more sensitive
  const controls_number = [
    { id: 0, tag: "smx", prev: 0, curr: 0, range: [-100, 100] },
    { id: 1, tag: "smy", prev: 0, curr: 0, range: [-100, 100] },
    { id: 2, tag: "srx", prev: 0, curr: 0, range: [-100, 100] },
    { id: 3, tag: "sry", prev: 0, curr: 0, range: [-100, 100] },
    { id: -1, tag: "srm", prev: 0, curr: 0, range: [0, 100] },
    { id: -1, tag: "sra", prev: 0, curr: 0, range: [0, 360] },
  ];

  const controls_bool = [{ id: 0, tag: "srp", prev: true, curr: true }];

  const packet_types = [
    { id: 0x00, type: "dbl", target: [0, 1], counter: 0 },
    { id: 0x01, type: "dbl", target: [4, 5], counter: 0 },
    { id: 0x01, type: "bool", target: [0], counter: 0 },
  ];
  setInterval(() => {
    const x = controls_number[2].curr;
    const y = controls_number[3].curr;

    controls_number[4].curr = Math.sqrt(x * x + y * y);
    controls_number[5].curr = (Math.atan2(y, x) * 180.0) / Math.PI + 90.0;
    if (controls_number[5].curr < 0) controls_number[5].curr += 360.0;

    if (!$sock_store) return;

    const packet_candidates = packet_types
      .filter((pkt) => {
        if (pkt.type == "bool")
          return pkt.target
            .map((t) => controls_bool[t])
            .some((x) => x.curr != x.prev);
        else if (pkt.type == "dbl")
          return pkt.target
            .map((t) => controls_number[t])
            .some((x) => x.curr != x.prev);
        else return false;
      })
      .sort((a, b) => b.counter - a.counter);

    if (packet_candidates.length == 0) return;

    const control = packet_candidates[0];

    packet_types.forEach((pkt) => {
      if (pkt == control) pkt.counter = 0;
      else pkt.counter += 1;
    });

    if (control.type == "dbl") {
      const control1 = controls_number[control.target[0]];
      const control2 = controls_number[control.target[1]];
      if (control1.curr == control1.prev && control2.curr == control2.prev) {
        return;
      }

      control1.prev = control1.curr;
      control2.prev = control2.curr;

      const byte1 = Math.round(
        ((control1.curr - control1.range[0]) /
          (control1.range[1] - control1.range[0])) *
          255.0
      );

      const byte2 = Math.round(
        ((control2.curr - control2.range[0]) /
          (control2.range[1] - control2.range[0])) *
          255.0
      );

      const buf = new ArrayBuffer(3);
      const view = new DataView(buf);

      view.setUint8(0, 0x40 | control.id);
      view.setUint8(1, byte1);
      view.setUint8(2, byte2);

      $sock_store.send(buf);
      console.log(
        [...new Uint8Array(buf)].map((x) => x.toString(16)).join(" ")
      );
      return;
    } else if (control.type == "bool") {
      const control1 = controls_bool[control.target[0]];
      if (control1.curr == control1.prev) return;

      control1.prev = control1.curr;

      const buf = new ArrayBuffer(1);
      const view = new DataView(buf);

      view.setUint8(0, control.id | (control1.curr ? 0x20 : 0x00));

      $sock_store.send(buf);
      console.log(
        [...new Uint8Array(buf)].map((x) => x.toString(16)).join(" ")
      );
      return;
    }
  }, 100);
</script>

<div class="container">
  <TabContainer
    style="flex-grow: 1; display: flexbox;"
    names={["Control", "Connection", "Calibration"]}
    tag="2023-korobo-nc"
  >
    <TabContent
      name="Control"
      style="position: relative; height: 100%; width: 100%; flex: 1 1 auto;"
    >
      <div
        style="position: fixed; top: 50%; right: 50%; transform: translate(50%, -50%);"
      >
        <img src={SrAbe2} width="230px" alt="logo" />
      </div>
      <Joystick
        radius={200}
        bind:x_val={controls_number[0].curr}
        bind:y_val={controls_number[1].curr}
        tag="sm"
        stick_name="Steering Move"
        style="position: absolute; bottom: 0; left: 0;"
      />
      <Joystick
        radius={200}
        bind:x_val={controls_number[2].curr}
        bind:y_val={controls_number[3].curr}
        tag="sr"
        stick_name=""
        style="position: absolute; bottom: 0; right: 0;"
      />
      <div style="position: absolute; top: calc(100% - 240px); right: 0;">
        PID Enabled
        <Toggle bind:value={controls_bool[0].curr}></Toggle>
      </div>
      <div
        style="position: absolute; height: 5rem; bottom: 0; right: 300px; left: 300px; background-color: #eee8; overflow: hidden; line-height: 1em;"
      >
        {#each $console_texts.slice(-5) as line}
          {line.time.toTimeString().slice(0, 8)}: {line.text}<br />
        {/each}
      </div>
    </TabContent>
    <TabContent name="Connection">
      <TextInput bind:value={$url_store} height="3em" line_height="1em" />
      <span>
        {$sock_store ? "Connected" : "Not Connected"}
      </span>
      <Button
        height="60px"
        width="120px"
        on:click={() => {
          connect();
        }}>Connect</Button
      >
    </TabContent>
  </TabContainer>
</div>

<style>
  div.container {
    height: 100%;
    width: 100%;

    text-shadow: 0px 0px 3px #ccc;
  }
</style>
