<script lang="ts">
  import { type Writable, writable } from "svelte/store";
  import { Statuses } from "./data/status_bytes";

  export let device: {
    last_ping: Writable<number>;
    status: Writable<number>;
  };

  const last_ping = device.last_ping;
  const status = device.status;

  let now = writable(Date.now());

  setInterval(() => {
    now.set(Date.now() / 1000);
  }, 1);
</script>

{#if $status == -1 && $last_ping == 0}
  No Data
{:else}
  {#if $status == -1}
    Unknown
  {:else}
    {Statuses[$status] ?? `0x${$status.toString(16)}`}
  {/if}

  ({#if $last_ping == 0}
    No data
  {:else}
    {(-Math.floor(($last_ping - $now) * 100) / 100).toFixed(2)} secs ago
  {/if})
{/if}
