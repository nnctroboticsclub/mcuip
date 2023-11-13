<script lang="ts">
  import { patch_console_log, subscribe_console_log } from "$lib/console_patch";
  import Window from "./window.svelte";
  import { onMount } from "svelte";

  let log: string = "";

  onMount(() => {
    patch_console_log();
    let unsubscribe = subscribe_console_log((text) => {
      log += text + "\n";
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<Window>
  <svelte:fragment slot="title">Console log</svelte:fragment>

  <div class="container" slot="app">
    {#each log.split("\n") as line}
      <div>{line}</div>
    {/each}
  </div>
</Window>

<style>
  div.container {
    background-color: #ccc;
    height: 100%;
    width: 100%;
  }
</style>
