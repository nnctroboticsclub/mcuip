<script lang="ts">
  import Button from "$lib/ui/button.svelte";
  import Window from "$lib/window/window.svelte";
  import { app_import_map } from "$lib/window/window_resolver";
  import { WindowManagerContext } from "$lib/window/windows";
  import { writable } from "svelte/store";

  const application_list = Object.keys(app_import_map);

  const windows = WindowManagerContext.getContext();
</script>

<Window>
  <svelte:fragment slot="title">AppLauncher</svelte:fragment>
  <svelte:fragment slot="app">
    {#each application_list as app_name}
      <div class="button-container">
        <Button
          width="100%"
          height="100%"
          on:click={() => {
            windows.launch(app_name, {});
          }}
          tooltip={app_name}>{app_name}</Button
        >
      </div>
    {/each}
  </svelte:fragment>
</Window>

<style>
  div.button-container {
    height: 70px;
    width: 140px;
    margin: 5px;

    display: inline-block;
  }
</style>
