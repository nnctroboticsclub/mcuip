<script lang="ts">
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { get } from "svelte/store";
  import WindowWrapper from "./window_wrapper.svelte";
  import { WindowManagerContext } from "./windows";

  export let width: number;
  export let height: number;

  const context = WindowManagerContext.getContext();
  const windows = context.windows;

  // Window life cycle
  setInterval(() => {
    const $windows = get(windows);
    const new_windows = $windows.filter(
      (window) => get(window.status) !== "Closing"
    );

    if (new_windows.length !== $windows.length) {
      windows.set(new_windows);
    }
  }, 100);
</script>

<DraggableArea top={0} left={0} {width} {height}>
  {#each $windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
