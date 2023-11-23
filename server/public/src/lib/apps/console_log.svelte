<script lang="ts">
  import { patch_console_log, subscribe_console_log } from "$lib/console_patch";
  import Window from "../window/window.svelte";
  import { onMount } from "svelte";

  let lines: string[] = [];

  onMount(() => {
    patch_console_log();
    let unsubscribe = subscribe_console_log((text) => {
      lines = [...lines, text].slice(-10);
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<Window>
  <svelte:fragment slot="title">Console</svelte:fragment>

  <div class="container" slot="app">
    {#each lines as line, i}
      {i}: {line}<br />
    {/each}
  </div>
</Window>

<style>
  div.container {
    height: 100%;
    width: 100%;
  }
</style>
