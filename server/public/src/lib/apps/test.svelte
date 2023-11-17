<script lang="ts">
  import Window from "./window.svelte";

  export let data: object;

  console.log("Test rendered");
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">
    App
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </svelte:fragment>
</Window>
