<script lang="ts">
  import { setWindow, type WindowConfig } from "$lib/window/window";
  import { getAppComponent } from "$lib/window/window_resolver";

  export let window: WindowConfig;

  $: setWindow(window);
</script>

{#if !window.app_name}
  <p>App not found</p>
{:else}
  {#await getAppComponent(window.app_name)}
    <p>Loading app... ({window.app_name})</p>
  {:then app}
    <svelte:component this={app} />
  {:catch error}
    <p>An error has occurred when loading component ({window.app_name})</p>
    <p>error: {error.message}</p>
    {console.error(error), error.stack}
  {/await}
{/if}
