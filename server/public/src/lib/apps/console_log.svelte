<script lang="ts">
  import { patch_console_log, subscribe_console_log } from "$lib/console_patch";
  import Window from "./window.svelte";
  import { onMount } from "svelte";

  export let data: {
    lines: string[];
  };

  if (data == undefined) {
    data = {
      lines: [],
    };
  }

  onMount(() => {
    patch_console_log();
    let unsubscribe = subscribe_console_log((text) => {
      if (!data.lines) {
        data.lines = [];
      }
      data.lines.push(text);
      data = data;
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<Window>
  <svelte:fragment slot="title">Console</svelte:fragment>

  <div class="container" slot="app">
    {#if data.lines}
      {#each data.lines as line}
        {line}<br />
      {/each}
    {:else}
      Loading...
    {/if}
  </div>
</Window>

<style>
  div.container {
    height: 100%;
    width: 100%;
  }
</style>
