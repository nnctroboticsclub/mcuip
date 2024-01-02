<script lang="ts">
  import Joystick from "$lib/ui/joystick.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import { getWindow } from "$lib/window/window";
  import { get } from "svelte/store";

  const url_store = getWindow().getDataStore<string>("url");
  const sock_store = getWindow().getDataStore<WebSocket>("socket");

  const packet_cooldown_ms = 10; // 10 tick (100ms)

  if (!$url_store) {
    url_store.set("ws://192.168.137.26/robo-ctrl");
  }

  async function connect() {
    const sock = new WebSocket(get(url_store));

    sock.onmessage = (e) => {
      console.log(e.data);
    };

    sock.onerror = (e) => {
      console.log(e);
    };

    sock.onclose = (e) => {
      console.log(e);
    };

    await new Promise((resolve) => {
      sock.onopen = () => {
        resolve(null);
      };
    });

    sock_store.set(sock);
  }

  let x0: number, y0: number;
  let x1: number, y1: number;
  let x2: number, y2: number;

  let j1_mag: number, j1_angle: number;
  $: {
    j1_mag = Math.sqrt(x1 * x1 + y1 * y1);
    j1_angle = (Math.atan2(y1, x1) * 180.0) / Math.PI + 90.0;
    if (j1_angle < 0) j1_angle += 360.0;
  }

  let prev_x0: number, prev_y0: number;
  let prev_x1: number, prev_y1: number;

  let packet_cooldown = 0;

  setInterval(() => {
    const buf = new ArrayBuffer(3);
    const view = new DataView(buf);

    if (!$sock_store) return;

    if (packet_cooldown > 0) {
      console.log("Cooldown");
      packet_cooldown -= 1;
      return;
    }

    let x1_effective = j1_mag;
    let y1_effective = j1_angle;
    if (y1_effective < 0) y1_effective += 360.0;

    let delta_x0 = x0 - prev_x0;
    let delta_y0 = y0 - prev_y0;
    let delta_x1 = x1_effective - prev_x1;
    let delta_y1 = y1_effective - prev_y1;

    prev_x0 = x0;
    prev_y0 = y0;
    prev_x1 = x1_effective;
    prev_y1 = y1_effective;

    if (delta_x0 == 0 && delta_y0 == 0 && delta_x1 == 0 && delta_y1 == 0) {
      return;
    }

    if (delta_x0 != 0 || delta_y0 != 0) {
      view.setUint8(0, 0x40);
      view.setUint8(1, Math.round(((x0 + 100) / 200.0) * 255.0));
      view.setUint8(2, Math.round(((y0 + 100) / 200.0) * 255.0));
      $sock_store?.send(buf);
    }

    if (delta_x1 != 0 || delta_y1 != 0) {
      view.setUint8(0, 0x41);
      view.setUint8(1, Math.round((x1_effective / 100.0) * 255.0));
      view.setUint8(2, Math.round((y1_effective / 360.0) * 255.0));
      $sock_store?.send(buf);
    }

    console.log("Sent!");
    packet_cooldown = packet_cooldown_ms;
  }, 1000 / 100);
</script>

<div class="app-container">
  <TabContainer
    style="flex-grow: 1;"
    names={["Control", "Connection", "Control"]}
    tag="2023-korobo-nc"
  >
    <TabContent name="Control">
      <div class="row">
        <Joystick
          radius={200}
          bind:x_val={x0}
          bind:y_val={y0}
          tag="sm"
          stick_name="Steering Move"
        />
        <Joystick
          radius={200}
          bind:x_val={x1}
          bind:y_val={y1}
          tag="sr"
          stick_name="Steering Rotation"
        />
        <Joystick
          radius={200}
          bind:x_val={x2}
          bind:y_val={y2}
          tag="ru"
          stick_name="Rotation Up"
        />
      </div>
    </TabContent>
    <TabContent name="Connection">
      <TextInput bind:value={$url_store} height="3em" line_height="1em" />
    </TabContent>
  </TabContainer>
  <div
    style="flex: 120px 0 0; height: 100%; display: flexbox; flex-direction: column;"
  >
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
  </div>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
</style>
