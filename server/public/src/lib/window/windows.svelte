<script lang="ts">
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import WindowWrapper from "./window_wrapper.svelte";
  import { WindowManagerContext } from "./windows";

  export let width: number;
  export let height: number;

  const context = WindowManagerContext.getContext();
  const windows = context.getWindowsStore();
</script>

<DraggableArea top={0} left={0} {width} {height}>
  {#each $windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
