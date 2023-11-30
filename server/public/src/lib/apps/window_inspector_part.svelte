<script lang="ts">
  import type { WindowConfig } from "$lib/window/window";

  export let window: WindowConfig;

  const { area, window_data: data } = window;
</script>

{#if !window}
  ==== window not found ====
{:else}
  Name: {window.app_name} <br />
  Area: {$area.toString()} <br />
  Z-index: {window.z_index} <br />
  WindowData: <br />
  {JSON.stringify($data, null, 2)}
{/if}
