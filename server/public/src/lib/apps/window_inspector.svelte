<script lang="ts">
  import Window from "../window/window.svelte";
  import { WindowManagerContext } from "$lib/window/windows";
  import WindowInspectorPart from "./window_inspector_part.svelte";

  const window_manager = WindowManagerContext.getContext();
  const windows = window_manager.windows;
</script>

<Window>
  <svelte:fragment slot="title"
    >Window status ({windows.length})</svelte:fragment
  >
  <svelte:fragment slot="app">
    <div class="container">
      {#each windows as window}
        <div>
          <WindowInspectorPart {window} />
        </div>
      {/each}
    </div>
  </svelte:fragment>
</Window>

<style>
  div.container {
    height: 100%;
    width: 100%;
  }

  div.container div:not(:last-child) {
    border-bottom: 1px solid #aaa;
  }
</style>
