<script>
  import Window from "$lib/window/window.svelte";
  import RoboFramework from "./robo-framework/robo-fw.svelte";
</script>

<Window>
  <svelte:fragment slot="title">Robo Framework</svelte:fragment>
  <svelte:fragment slot="app">
    <RoboFramework></RoboFramework>
  </svelte:fragment>
</Window>
