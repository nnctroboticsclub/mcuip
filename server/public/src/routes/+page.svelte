<script lang="ts">
  import { WindowManagerContext } from "$lib/window/windows";
  import { writable } from "svelte/store";
  import { WindowConfig } from "$lib/window/window";
  import { Area } from "$lib/ui/area";
  import Windows from "$lib/window/windows.svelte";
  import { patch_console_log } from "$lib/console_patch";

  let width: number, height: number;

  patch_console_log();

  const window_manager = WindowManagerContext.getContext();
  window_manager.addWindow(new Area(600, 0, 600, 300), "console_log", {});
  window_manager.addWindow(new Area(0, 0, 600, 110), "launcher", {});
  window_manager.addWindow(new Area(130, 0, 600, 400), "mcuip-ctrl", {});
  window_manager.addWindow(new Area(0, 620, 300, 800), "window_inspector", {});
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
