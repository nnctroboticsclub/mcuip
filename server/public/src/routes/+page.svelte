<script lang="ts">
  import WindowWrapper from "$lib/window/window_wrapper.svelte";
  import { windows } from "$lib/window/windows";

  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import { Position } from "$lib/dragger/position";

  let width: number, height: number;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<DraggableArea top={0} left={0} width={width * 0.95} height={height * 0.95}>
  {#each windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
