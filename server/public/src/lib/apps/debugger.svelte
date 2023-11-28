<script lang="ts">
  import { writable } from "svelte/store";
  import { global_state } from "../../global_state";
  import Window from "../window/window.svelte";
  import DebuggerTree from "./debugger_tree.svelte";

  export let object: { [key: string]: any } = global_state;
</script>

<Window>
  <svelte:fragment slot="title">Debugger</svelte:fragment>
  <svelte:fragment slot="app">
    <DebuggerTree object={writable(object)} />
  </svelte:fragment>
</Window>
