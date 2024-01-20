<script lang="ts">
  import { type Writable, writable } from "svelte/store";

  export let last_ping: Writable<number> = writable(0);

  let now = writable(Date.now());

  setInterval(() => {
    now.set(Date.now() / 1000);
  }, 1);
</script>

{#if $last_ping == 0}
  No data
{:else}
  {(-Math.floor(($last_ping - $now) * 100) / 100).toFixed(2)} secs ago
{/if}
