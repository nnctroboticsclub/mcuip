<script lang="ts">
  import { console_texts, patch_console_log } from "$lib/console_patch";
  import Window from "../window/window.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    patch_console_log();
  });
</script>

<Window>
  <svelte:fragment slot="title">Console</svelte:fragment>

  <div class="container" slot="app">
    {#each $console_texts as line, i}
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
