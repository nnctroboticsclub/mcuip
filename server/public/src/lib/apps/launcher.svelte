<script lang="ts">
  import Button from "$lib/ui/button.svelte";
  import Window from "$lib/window/window.svelte";
  import { app_import_map } from "$lib/window/window_resolver";
  import { WindowManagerContext } from "$lib/window/windows";

  const application_list = Object.keys(app_import_map);

  const windows = WindowManagerContext.getContext();
</script>

<Window>
  <svelte:fragment slot="title">AppLauncher</svelte:fragment>
  <svelte:fragment slot="app">
    {#each application_list as app_name}
      <div>
        <Button
          on:click={() => {
            windows.launch(app_name);
          }}>Launch '{app_name}'</Button
        >
      </div>
    {/each}
  </svelte:fragment>
</Window>
