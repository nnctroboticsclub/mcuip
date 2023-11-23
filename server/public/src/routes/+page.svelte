<script lang="ts">
  import WindowWrapper from "$lib/window/window_wrapper.svelte";
  import { windows } from "$lib/window/windows";

  import DraggableArea from "$lib/dragger/draggable_area.svelte";

  let width: number, height: number;
</script>

<div class="container" bind:clientWidth={width} bind:clientHeight={height}>
  <DraggableArea top={0} left={0} {width} {height}>
    {#each windows as window}
      <WindowWrapper {window} />
    {/each}
  </DraggableArea>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
