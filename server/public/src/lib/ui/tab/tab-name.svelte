<script lang="ts">
  import { TabContext } from "./context";

  export let name: string;

  const ctx = TabContext.getContext()?.active_tab_name;
</script>

<button
  on:click={() => {
    ctx?.set(name);
  }}
  class:active={$ctx === name}
>
  {#if ctx}
    {name}
  {:else}
    [Bad] {name}
  {/if}
</button>

<style>
  button {
    flex: 1;
    background-color: #eee;
    padding: 10px;

    text-align: center;
    clip-path: polygon(
      5% 5%,
      95% 5%,
      95% calc(95% - 20px),
      calc(95% - 20px) 95%,
      5% 95%
    );
  }

  button.active {
    background-color: #fff;
  }
</style>
