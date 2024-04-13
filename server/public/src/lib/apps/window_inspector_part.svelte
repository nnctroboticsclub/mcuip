<script lang="ts">
  import type { WindowConfig } from "$lib/window/window";
  import { derived } from "svelte/store";

  export let window: WindowConfig;

  const { area, z_index, window_data: data } = window;

  const data_store = derived(
    Object.keys(data).map((key) => derived(data[key], (value) => [key, value])),
    (values) => Object.fromEntries(values.map(([a, b]) => [a, b]))
  );
</script>

{#if !window}
  ==== window not found ====
{:else}
  {@html window.app_name.padStart(20, " ").replaceAll(" ", "&nbsp;")}@{@html $area.toString().padStart(18).replaceAll(" ", "&nbsp;")} z={$z_index} <br />
  WindowData: <br />
  {JSON.stringify($data_store, null, 2)}
{/if}
