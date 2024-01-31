<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  export let val: Writable<number> = writable(0);
</script>

{Math.sign($val) == 1 ? "+" : "-"}{Math.abs($val).toFixed(2)}%
