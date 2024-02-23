<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ click: void }>();

  export let width: string = "100px";
  export let height: string = "1.5em";
  export let color: string = "#8888ff";
  export let active_color: string = "#5555ff";
  export let style: string = "";

  export let tooltip: string = "";
</script>

<button
  style="width: {width}; height: {height}; --color: {color}; --active-color: {active_color}; {style}"
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

    background-color: var(--color);
    border-radius: 3px;

    cursor: pointer;
  }

  button:active {
    background-color: var(--active-color);
  }
</style>
