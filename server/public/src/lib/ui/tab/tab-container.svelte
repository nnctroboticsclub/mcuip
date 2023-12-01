<script lang="ts">
  import TabName from "./tab-name.svelte";
  import { TabContext } from "./context";

  export let tag: string;
  export let names: string[];
  export let height: string = "100%";

  const ctx = TabContext.setContext(tag);

  const active_tab_name = ctx.active_tab_name;
  const tab_names = ctx.tab_names;

  if (!$active_tab_name) $active_tab_name = names[0];
  if (!$tab_names) $tab_names = names;
</script>

<div class="container" style="height: {height};">
  <div class="tab-bar">
    {#each names as name}
      <TabName {name} />
    {/each}
  </div>
  <div class="contents">
    <slot />
  </div>
</div>

<style>
  div.container > div.tab-bar {
    margin-top: 5px;
    display: flex;
    padding-bottom: 5px;
    border-bottom: 1px solid #888;
    margin-bottom: 5px;
  }
  div.container {
    display: flex;
    flex-direction: column;
    border: 1px solid #888;
    border-radius: 5px;
  }
</style>
