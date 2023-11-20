<script lang="ts">
  import { setContext } from "svelte";

  export let style: {
    top: string;
    left: string;
    width: string;
    height: string;
  };

  let window_width: number;
  let window_height: number;

  setContext("window_style", style);
</script>

<svelte:window
  bind:innerWidth={window_width}
  bind:innerHeight={window_height}
/>0

<slot />
