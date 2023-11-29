<script lang="ts">
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { get } from "svelte/store";
  import WindowWrapper from "./window_wrapper.svelte";
  import { WindowManagerContext } from "./windows";
  import Button from "$lib/ui/button.svelte";
  import type { WindowConfig } from "./window";

  export let width: number;
  export let height: number;

  const context = WindowManagerContext.getContext();
  const windows = context.windows;

  // Window life cycle
  function deleteClosedWindow(
    $windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    const new_windows = $windows.filter(
      (window) => get(window.status) !== "Closing"
    );

    if (new_windows.length !== $windows.length) {
      console.log(
        `Found ${$windows.length - new_windows.length} closed window`
      );
      return [true, new_windows];
    }
    return [false, $windows];
  }

  function fixZIndexConflict(
    $windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    const conflict_table = Object.fromEntries(
      $windows
        .map((window) => window.z_index)
        .map((z_index) => [
          z_index,
          $windows.filter((window) => window.z_index === z_index).length,
        ])
    );
    if (Object.values(conflict_table).every((count) => count === 1)) {
      return [false, $windows];
    }

    let edited_z_indexes = 0;
    const new_windows = $windows.map((window) => {
      const z_index = window.z_index;
      const count = conflict_table[z_index];
      if (count === 1) {
        return window;
      }

      const new_z_index = z_index + count;
      conflict_table[z_index] -= 1;

      window.z_index = new_z_index;
      edited_z_indexes += 1;

      return window;
    });
    console.log(`Found ${edited_z_indexes} conflict`);
    return [true, new_windows];
  }

  function reduceZIndexGaps(
    $windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    // むずい
    return [false, $windows];
  }

  function lifecycle() {
    console.log("===== Doing lifecycle()");
    console.log("==> Delete closed window");
    const [stage1_updated, stage1_windows] = deleteClosedWindow($windows);
    console.log("==> Delete fix conflict");
    const [stage2_updated, stage2_windows] = fixZIndexConflict(stage1_windows);
    console.log("==> Reduce z-index gaps");
    const [stage3_updated, stage3_windows] = reduceZIndexGaps(stage2_windows);

    if (stage1_updated || stage2_updated || stage3_updated) {
      context.windows.set(stage3_windows);
    }
  }

  setTimeout(lifecycle, 200);
</script>

<Button on:click={lifecycle}>Lifecycle</Button>
<DraggableArea top={0} left={0} {width} {height}>
  {#each $windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
