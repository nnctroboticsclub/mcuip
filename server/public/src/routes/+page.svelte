<script lang="ts">
  import WindowWrapper from "$lib/apps/window_wrapper.svelte";
  import { windows } from "$lib/window/windows";

  import DraggableArea from "$lib/dragger/area.svelte";

  let width: number, height: number;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<DraggableArea top={0} left={0} width={width / 2} height={height / 2}>
  <!-- {#each windows as window}
    <WindowWrapper {window} />
  {/each} -->
</DraggableArea>
