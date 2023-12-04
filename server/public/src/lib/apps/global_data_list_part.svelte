<script lang="ts">
  import type { Writable } from "svelte/store";

  export let key: string;
  export let value: Writable<string>;
</script>

<span>{key} {$value}</span>
