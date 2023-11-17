<script lang="ts">
  import {
    setAppData,
    setWindowIndex,
    type WindowConfig,
  } from "$lib/window/window";
  import { getAppComponent } from "$lib/window/window_resolver";
  import { windows } from "$lib/window/windows";
  import type { Writable } from "svelte/store";

  export let window_index: number;

  let window: WindowConfig;
  $: window = windows[window_index];

  let app_store = window && window.window_data;
  $: app_store = window && window.window_data;

  $: setWindowIndex(window_index);
  $: setAppData($app_store);
</script>

{#if !window}
  <p>Specified window not found (index = {window_index})</p>
{:else if !window.app_name}
  <p>App not found</p>
{:else}
  {#await getAppComponent(window, window.app_name)}
    <p>Loading app... ({window.app_name})</p>
  {:then app}
    <svelte:component this={app} />
  {:catch error}
    <p>An error has occurred when loading component</p>
    <p>error: {error.message}</p>
  {/await}
{/if}
