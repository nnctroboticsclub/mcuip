<script lang="ts">
  import { TabContext } from "./context";

  export let name: string;

  const ctx = TabContext.getContext();

  const active_tab_name = ctx?.active_tab_name;
</script>

{#if active_tab_name}
  {#if $active_tab_name === name}
    <slot />
  {/if}
{:else}
  [WARN]: TabContext is not found<br />
{/if}
