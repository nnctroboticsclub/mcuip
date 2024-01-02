<script lang="ts">
  import { TabContext } from "./context";

  export let name: string;
  export let style: string = "";

  const ctx = TabContext.getContext();

  const active_tab_name = ctx?.active_tab_name;
</script>

{#if active_tab_name}
  <div class:active={$active_tab_name === name} {style}>
    <slot />
  </div>
{:else}
  [WARN]: TabContext is not found<br />
{/if}

<style>
  div {
    display: none;
  }

  div.active {
    display: block;
  }
</style>
