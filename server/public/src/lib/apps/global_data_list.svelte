<script lang="ts">
  import { writable } from "svelte/store";
  import { global_state } from "../../global_state";
  import Window from "../window/window.svelte";
  import DebuggerTree from "./debugger_tree.svelte";
  import { shared_data } from "$lib/shared_data/global";

  export let object: { [key: string]: any } = global_state;

  const store = shared_data.dataListStore();
</script>

<Window>
  <svelte:fragment slot="title">Global Data List</svelte:fragment>
  <svelte:fragment slot="app">
    {#each $store as item}
      {item}
    {/each}
  </svelte:fragment>
</Window>
