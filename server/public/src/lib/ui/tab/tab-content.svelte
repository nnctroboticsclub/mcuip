<script lang="ts">
  import { TabContext } from "./context";

  export let name: string;
  export let style: string = "";
  export let whatever: boolean = false;

  const ctx = TabContext.getContext();

  const active_tab_name = ctx?.active_tab_name;
  const tab_bar_mode_deactivate_node = ctx?.tab_bar_mode_deactivate_node;
</script>

{#if !active_tab_name}
  [WARN]: TabContext is not found or active_tab_name is undefined<br />
{:else if !tab_bar_mode_deactivate_node}
  [WARN]: TabContext is not found or tab_bar_mode_deactivate_node is undefined<br
  />
{:else if !$tab_bar_mode_deactivate_node}
  <div class:active={whatever || $active_tab_name === name} {style}>
    <slot />
  </div>
{:else if $tab_bar_mode_deactivate_node && (whatever || $active_tab_name === name)}
  <div class:active={true} {style}>
    <slot />
  </div>
{/if}

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: block;

    transition: all 0.1s;
    opacity: 0;

    z-index: 0;
  }

  div.active {
    display: block;

    opacity: 1;

    z-index: 1;
  }
</style>
