<script lang="ts">
  import { TabContext } from "./context";

  export let name: string;
  export let tab_size: string | "auto" = "auto";

  const flex = tab_size === "auto" ? "1 1 auto" : `0 0 ${tab_size}`;

  const ctx = TabContext.getContext()?.active_tab_name;
</script>

<button
  on:click={() => {
    ctx?.set(name);
  }}
  style="flex: {flex};"
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
      95% calc(95% - 15px),
      calc(95% - 15px) 95%,
      5% 95%
    );
  }

  button.active {
    background-color: #fff;
  }
</style>
