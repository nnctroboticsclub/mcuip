<script lang="ts">
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { get } from "svelte/store";
  import WindowWrapper from "./window_wrapper.svelte";
  import { WindowManagerContext } from "./windows";
  import Button from "$lib/ui/button.svelte";
  import type { WindowConfig } from "./window";
  import { onMount } from "svelte";

  export let width: number;
  export let height: number;

  const context = WindowManagerContext.getContext();
  const windows = context.windows;

  // Window life cycle
  function deleteClosedWindow(
    windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    const new_windows = windows.filter(
      (window) => get(window.status) !== "Closing"
    );

    if (new_windows.length !== windows.length) {
      return [true, new_windows];
    }
    return [false, windows];
  }

  function lifecycle() {
    deleteClosedWindow(windows);
  }

  onMount(() => {
    const interval = setInterval(lifecycle, 10);
    return () => clearInterval(interval);
  });
</script>

<Button on:click={lifecycle}>Lifecycle</Button>
<DraggableArea top={0} left={0} {width} {height}>
  {#each windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
