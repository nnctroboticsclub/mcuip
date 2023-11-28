<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import type { Writable } from "svelte/store";
  import Window from "../window/window.svelte";
  import { onMount } from "svelte";
  import Toggle from "$lib/components/ui/toggle.svelte";

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
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">
    Time: {$data.time}<br />

    <Toggle bind:value /> <br />
    value: {value}
  </svelte:fragment>
</Window>
