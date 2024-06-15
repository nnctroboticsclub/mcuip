<script lang="ts">
  import { type Writable, writable } from "svelte/store";

  export let value: Writable<number> = writable(0);
</script>

{$value.toFixed(5)} %%
