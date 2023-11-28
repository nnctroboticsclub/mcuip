<script lang="ts">
  import { WindowManagerContext } from "$lib/window/windows";
  import { writable } from "svelte/store";
  import { WindowConfig } from "$lib/window/window";
  import { Area } from "$lib/ui/area";
  import Windows from "$lib/window/windows.svelte";

  let width: number, height: number;

  const window_manager = WindowManagerContext.getContext();
  window_manager.addWindow(
    new WindowConfig(
      writable(new Area(0, 300, 300, 590)),
      "window_inspector",
      writable(undefined)
    )
  );
  window_manager.addWindow(
    new WindowConfig(
      writable(new Area(600, 0, 600, 300)),
      "console_log",
      writable(undefined)
    )
  );
  window_manager.addWindow(
    new WindowConfig(
      writable(new Area(0, 0, 300, 300)),
      "test",
      writable(undefined)
    )
  );
  window_manager.addWindow(
    new WindowConfig(
      writable(new Area(0, 600, 300, 900)),
      "debugger",
      writable(undefined)
    )
  );
</script>

<div class="container" bind:clientWidth={width} bind:clientHeight={height}>
  <Windows {width} {height} />
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
