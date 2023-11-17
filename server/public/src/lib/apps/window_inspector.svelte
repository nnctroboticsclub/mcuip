<script lang="ts">
  import type { WindowConfig } from "$lib/window/window";
  import { windows } from "$lib/window/windows";
  import { derived } from "svelte/store";
  import Window from "./window.svelte";

  let unsubscribes: (() => void)[] = [];
  let window_data: { tag: string; text: string[] }[] = [];

  function loadWindows() {
    console.log("Loading Windows");
    unsubscribes.forEach((unsubscribe) => unsubscribe());
    window_data = [];

    const appendWindowInfo = (window: WindowConfig) => {
      const tag = [...new Array(2)]
        .map((_) => Math.random().toString(36).substring(2, 10))
        .join("");

      const line_store = derived(
        [
          window.top,
          window.left,
          window.width,
          window.height,
          window.window_data,
        ],
        ([top, left, width, height, data]) => [
          `Name: ${window.app_name}`,
          `(${top}, ${left}) +(${width}, ${height})`,
          "WindowData:",
          JSON.stringify(data, null, 2),
        ]
      );

      window_data.push({
        tag,
        text: [],
      });

      return line_store.subscribe((text) => {
        const index = window_data.findIndex((d) => d.tag == tag);
        if (index != -1) {
          window_data[index].text = text;
        }
        return window_data;
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
      {#each window_data as line}
        <div>
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
    height: 100%;
    width: 100%;
  }

  div.container div:not(:last-child) {
    border-bottom: 1px solid #aaa;
  }
</style>
