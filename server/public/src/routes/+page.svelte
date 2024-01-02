<script lang="ts">
  import { WindowManagerContext } from "$lib/window/windows";
  import { Area } from "$lib/ui/area";
  import Windows from "$lib/window/windows.svelte";
  import { patch_console_log } from "$lib/console_patch";
  import { WindowConfig, setWindow } from "$lib/window/window";
  import { writable } from "svelte/store";
  import Korobo2023ncMain from "$lib/apps/korobo-2023-nc/korobo2023nc-main.svelte";

  let width: number, height: number;

  patch_console_log();

  const window_manager = WindowManagerContext.getContext();
  // window_manager.addWindow(new Area(620, 0, 920, 300), "console_log", {});
  window_manager.addWindow(new Area(0, 0, 600, 110), "launcher", {});
  // window_manager.addWindow(new Area(130, 0, 600, 470), "mcuip-ctrl", {});
  // window_manager.addWindow(new Area(0, 620, 300, 600), "window_inspector", {});
  window_manager.addWindow(new Area(0, 0, 1000, 330), "2023-korobo-nc", {});

  setWindow(
    new WindowConfig(
      writable(new Area(0, 0, 0, 0)),
      "2023-korobo-nc",
      {},
      writable(0)
    )
  );
</script>

<div class="container" bind:clientWidth={width} bind:clientHeight={height}>
  <!-- <Windows {width} {height} /> -->
  <Korobo2023ncMain></Korobo2023ncMain>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
