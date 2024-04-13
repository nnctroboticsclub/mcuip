<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  export let val: Writable<number> = writable(0);
</script>

{$val.toFixed(3)}
