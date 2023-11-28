<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ click: void }>();

  export let width: string = "100px";
  export let height: string = "1.5em";

  export let tooltip: string = "";
</script>

<button
  style="width: {width}; height: {height};"
  title={tooltip}
  on:click={() => {
    dispatch("click");
  }}
>
  <slot />
</button>

<style>
  button {
    border: none;
    padding: 0;
    margin: 0;
    position: relative;

    vertical-align: middle;

    background-color: #79beeeff;
    border-radius: 10px;

    cursor: pointer;
  }

  button:active {
    background-color: #79beeeff;
  }
</style>
