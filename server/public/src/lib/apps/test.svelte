<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import type { Writable } from "svelte/store";
  import Window from "./window.svelte";
  import { onMount } from "svelte";

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

  console.log("Test rendered");
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">
    Time: {$data.time}
  </svelte:fragment>
</Window>
