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
  function applyInfinityZindex(
    $windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    const max_z_index = Math.max(
      ...$windows.map((window) => window.z_index).filter((x) => x !== Infinity)
    );

    let updated = false;
    const new_windows = $windows.map((window) => {
      if (window.z_index === Infinity) {
        window.z_index = max_z_index + 1;
        updated = true;
      }
      return window;
    });

    return [updated, new_windows];
  }

  function deleteClosedWindow(
    $windows: WindowConfig[]
  ): [boolean, WindowConfig[]] {
    const new_windows = $windows.filter(
      (window) => get(window.status) !== "Closing"
    );

    if (new_windows.length !== $windows.length) {
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
    return [true, new_windows];
  }

  function removeHeadEmptyZIndexes(
    $windows: WindowConfig[],
    updated: boolean
  ): [boolean, WindowConfig[]] {
    if (updated === false) {
      return [false, $windows];
    }

    const min_z_index = Math.min(
      ...$windows.map((window) => window.z_index).filter((x) => x !== Infinity)
    );

    const new_windows = $windows.map((window) => {
      window.z_index = window.z_index - min_z_index;
      return window;
    });

    return [min_z_index != 0, new_windows];
  }

  function lifecycle() {
    let updated = false;
    const [stage1_updated, stage1_windows] = applyInfinityZindex($windows);
    updated ||= stage1_updated;

    const [stage2_updated, stage2_windows] = deleteClosedWindow(stage1_windows);
    updated ||= stage2_updated;

    const [stage3_updated, stage3_windows] = fixZIndexConflict(stage2_windows);
    updated ||= stage3_updated;

    const [stage4_updated, stage4_windows] = removeHeadEmptyZIndexes(
      stage3_windows,
      updated
    );
    updated ||= stage4_updated;

    if (updated) {
      context.windows.set(stage4_windows);
    }
  }

  onMount(() => {
    const interval = setInterval(lifecycle, 10);
    return () => clearInterval(interval);
  });
</script>

<Button on:click={lifecycle}>Lifecycle</Button>
<DraggableArea top={0} left={0} {width} {height}>
  {#each $windows as window}
    <WindowWrapper {window} />
  {/each}
</DraggableArea>
