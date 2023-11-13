<script lang="ts">
  import Window from "./window.svelte";
</script>

<Window>
  <svelte:fragment slot="title">Title</svelte:fragment>
  <svelte:fragment slot="app">App</svelte:fragment>
</Window>
