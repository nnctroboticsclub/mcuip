<script lang="ts">
  import type { WindowConfig } from "$lib/window/window";
  import { windows } from "$lib/window/windows";
  import { derived } from "svelte/store";
  import Window from "./window.svelte";

  let window_debug_info: { tag: string; text: string[] }[] = [];
  let unsubscribes: (() => void)[] = [];

  function loadWindows() {
    console.log("Loading Windows");
    unsubscribes.forEach((unsubscribe) => unsubscribe());
    window_debug_info = [];

    const appendWindowInfo = (window: WindowConfig) => {
      const tag = [...new Array(2)]
        .map((_) => Math.random().toString(36).substring(2, 10))
        .join("");

      const line_store = derived(
        [window.top, window.left, window.width, window.height, window.app],
        ([top, left, width, height, app]) => [
          `name: ${app.name}`,
          `(${top}, ${left}) +(${width}, ${height})`,
        ]
      );

      window_debug_info.push({ tag, text: ["Loading..."] });

      return line_store.subscribe((text) => {
        const index = window_debug_info.findIndex((info) => info.tag == tag);
        if (index != -1) {
          window_debug_info[index].text = text;
        }
      });
    };

    unsubscribes = windows.map(appendWindowInfo);
  }

  let old_window_count = -1;
  function checkWindowCount() {
    if (old_window_count != windows.length) {
      loadWindows();
      old_window_count = windows.length;
    }

    setTimeout(checkWindowCount, 1000);
  }

  checkWindowCount();
</script>

<Window>
  <svelte:fragment slot="title"
    >Window status ({windows.length})</svelte:fragment
  >
  <svelte:fragment slot="app">
    <div class="container">
      {window_debug_info.length}<br />
      {#each window_debug_info as line}
        <div>
          {line.tag} <br />
          {#each line.text as l}
            {l} <br />
          {/each}
          <br />
        </div>
      {/each}
    </div>
  </svelte:fragment>
</Window>

<style>
  div.container {
    background-color: #ccc;
    height: 100%;
    width: 100%;
  }
</style>
