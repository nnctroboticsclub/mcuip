<script lang="ts">
  import Joystick from "$lib/ui/joystick.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import Toggle from "$lib/ui/toggle.svelte";
  import { console_texts } from "$lib/console_patch";
  import SrAbe2 from "./sr-abe-2.png";
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";

  const app = App.new_instance();
  const sock = app.sock;
  onMount(() => {
    const interval = setInterval(() => {
      app.tick();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  });
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
        bind:x_val={app.controls.num[0].curr}
        bind:y_val={app.controls.num[1].curr}
        tag="sm"
        stick_name="Steering Move"
        style="position: absolute; bottom: 0; left: 0;"
      />
      <Joystick
        radius={200}
        bind:x_val={app.controls.num[2].curr}
        bind:y_val={app.controls.num[3].curr}
        tag="sr"
        stick_name=""
        style="position: absolute; bottom: 0; right: 0;"
      />
      <div style="position: absolute; top: calc(100% - 240px); right: 0;">
        PID Enabled
        <Toggle bind:value={app.controls.bool[0].curr}></Toggle>
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
      <TextInput bind:value={app.url} height="3em" line_height="1em" />
      <span>
        {$sock ? "Connected" : "Not Connected"}
      </span>
      <Button
        height="60px"
        width="120px"
        on:click={() => {
          app.connect();
        }}>Connect</Button
      >
    </TabContent>
    <TabContent name="Calibration" style="height: 100%; width: 100%">
      <TabContainer
        tag="2023-korobo-nc-calib"
        style="height: 100%; width: 100%"
        names={["Steer Motor Kp", "Steer Motor Ki", "Steer Motor Kd"]}
        vertical={true}
        tab_size="1em"
      >
        <TabContent whatever={true} style="width: 100%; height: 100%" name=""
        ></TabContent>
      </TabContainer>
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
