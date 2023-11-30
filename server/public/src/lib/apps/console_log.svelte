<script lang="ts">
  import { console_texts } from "$lib/console_patch";
  import Window from "../window/window.svelte";
</script>

<Window>
  <svelte:fragment slot="title">Console</svelte:fragment>

  <div class="container" slot="app">
    {#each $console_texts.slice(-20) as line}
      {line.time.toISOString()}: {line.text}<br />
    {/each}
  </div>
</Window>

<style>
  div.container {
    height: 100%;
    width: 100%;
  }
</style>
