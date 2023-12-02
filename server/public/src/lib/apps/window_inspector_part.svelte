<script lang="ts">
  import Button from "$lib/ui/button.svelte";
  import type { WindowConfig } from "$lib/window/window";
  import { derived } from "svelte/store";

  export let window: WindowConfig;

  const { area, window_data: data } = window;

  const data_store = derived(
    Object.keys(data).map((key) => derived(data[key], (value) => [key, value])),
    (values) => Object.fromEntries(values.map(([a, b]) => [a, b]))
  );
</script>

{#if !window}
  ==== window not found ====
{:else}
  Name: {window.app_name} <br />
  Area: {$area.toString()} <br />
  WindowData: <br />
  {JSON.stringify($data_store, null, 2)}
{/if}
