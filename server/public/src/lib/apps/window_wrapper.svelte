<script lang="ts">
  import { setWindowIndex, type WindowConfig } from "$lib/window/window";
  import { getAppComponent } from "$lib/window/window_resolver";
  import { windows } from "$lib/window/windows";
  import type { Writable } from "svelte/store";

  export let window_index: number;

  let window: WindowConfig;
  $: window = windows[window_index];

  let app_store = window && window.app;
  $: app_store = window && window.app;

  $: setWindowIndex(window_index);
</script>

{#if !window}
  <p>Specified window not found (index = {window_index})</p>
{:else if !window.app}
  <p>App not found</p>
{:else}
  {#await getAppComponent(window, $app_store.name)}
    <p>Loading app... ({window.app})</p>
  {:then app}
    <svelte:component this={app} data={$app_store.data} />
  {:catch error}
    <p>An error has occurred when loading component</p>
    <p>error: {error.message}</p>
  {/await}
{/if}
