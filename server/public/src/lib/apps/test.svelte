<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import type { Writable } from "svelte/store";
  import Window from "../window/window.svelte";
  import { onMount } from "svelte";
  import { global_state } from "../../global_state";
  import Toggle from "$lib/ui/toggle.svelte";
  import Button from "$lib/ui/button.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import Joystick from "$lib/ui/joystick.svelte";

  const data = getWindow().getDataStore("time") as Writable<number>;
  const joy_x = getWindow().getDataStore("joy_x") as Writable<number>;
  const joy_y = getWindow().getDataStore("joy_y") as Writable<number>;

  if (!$data) {
    data.set(0);
  }

  if (!$joy_x) {
    joy_x.set(0);
  }

  if (!$joy_y) {
    joy_y.set(0);
  }

  onMount(() => {
    let interval = setInterval(() => {
      $data += 1;
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  let value = false;

  function switchTheme1() {
    global_state.theme.app.background_color.set("#eef");
    global_state.theme.app.appbar_color.set("#efe");
    global_state.theme.window.background_color.set("#ddf");
  }

  function switchTheme2() {
    global_state.theme.app.background_color.set("#eee");
    global_state.theme.app.appbar_color.set("#fcc");
    global_state.theme.window.background_color.set("#ccc");
  }
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">
    <TabContainer
      names={["Theme Switch", "UI Test", "Window state"]}
      tag="main-tab"
    >
      <TabContent name="Theme Switch">
        <Button width="200px" on:click={switchTheme1}>Switch theme (1)</Button
        ><br />
        <Button width="200px" on:click={switchTheme2}>Switch theme (2)</Button
        ><br />
      </TabContent>

      <TabContent name="UI Test">
        <Toggle bind:value /> <br />
        value: {value} <br />
        <Joystick bind:x_val={$joy_x} bind:y_val={$joy_y} /> <br />
        joystick x: {$joy_x} <br />
        joystick y: {$joy_y} <br />
      </TabContent>
      <TabContent name="Window state">
        Time: {$data}<br />
      </TabContent>
    </TabContainer>
  </svelte:fragment>
</Window>
