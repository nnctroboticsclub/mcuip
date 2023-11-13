<script lang="ts">
  import WindowWrapper from "$lib/apps/window_wrapper.svelte";
  import { windows } from "$lib/window/windows";
</script>

{#each windows as window, i}
  <WindowWrapper window_index={i} />
{/each}
