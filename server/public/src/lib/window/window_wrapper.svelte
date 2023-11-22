<script lang="ts">
  import { setWindow, type WindowConfig } from "$lib/window/window";
  import { getAppComponent } from "$lib/window/window_resolver";

  export let window: WindowConfig;

  $: setWindow(window);
</script>

{#if !window.app_name}
  <p>App not found</p>
{:else}
  {#await getAppComponent(window)}
    <p>Loading app... ({window.app_name})</p>
  {:then app}
    <svelte:component this={app} />
  {:catch error}
    <p>An error has occurred when loading component</p>
    <p>error: {error.message}</p>
  {/await}
{/if}
