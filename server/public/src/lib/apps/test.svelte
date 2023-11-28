<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import type { Writable } from "svelte/store";
  import Window from "../window/window.svelte";
  import { onMount } from "svelte";
  import Toggle from "$lib/components/ui/toggle.svelte";
  import { global_state } from "../../global_state";

  const data = getWindow().window_data as Writable<{
    time: number;
  }>;

  if (!$data) {
    data.set({
      time: 0,
    });
  }

  onMount(() => {
    let interval = setInterval(() => {
      $data.time += 1;
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  let value = false;

  function switchTheme1() {
    global_state.theme.global_background_color.set("#eef");
    global_state.theme.title_bar_color.set("#efe");
    global_state.theme.app_background_color.set("#ddf");
  }

  function switchTheme2() {
    global_state.theme.global_background_color.set("#eee");
    global_state.theme.title_bar_color.set("#fcc");
    global_state.theme.app_background_color.set("#ccc");
  }
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">
    Time: {$data.time}<br />

    <Toggle bind:value /> <br />
    value: {value}

    <button on:click={switchTheme1}>Switch theme (1)</button>
    <button on:click={switchTheme2}>Switch theme (2)</button>
  </svelte:fragment>
</Window>
