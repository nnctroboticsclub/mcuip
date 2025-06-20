<script lang="ts">
  import TabName from "./tab-name.svelte";
  import { TabContext } from "./context";
  import Button from "../button.svelte";

  export let tag: string;
  export let names: string[];
  export let height: string = "100%";
  export let style: string = "";
  export let vertical: boolean = false;
  export let tab_size: string | "auto" = "auto";
  export let classes: string[] = [];

  export let deactivate_node = false;

  const ctx = TabContext.setContext(tag);

  const active_tab_name = ctx.active_tab_name;
  const tab_names = ctx.tab_names;
  const tab_bar_collapsed = ctx.tab_bar_collapsed;
  const tab_bar_mode_deactivate_node = ctx.tab_bar_mode_deactivate_node;

  if (!$active_tab_name) $active_tab_name = names[0];
  if (!$tab_names) $tab_names = names;
  if (!$tab_bar_collapsed) $tab_bar_collapsed = false;
  if (!$tab_bar_mode_deactivate_node)
    $tab_bar_mode_deactivate_node = deactivate_node;
</script>

<div
  class="flex tab-container {classes.join(' ')}"
  style="height: {height}; {style};"
  class:vertical
>
  <div
    class="tab-bar border-0"
    style="border-color: #aaa;"
    class:border-l-[1px]={vertical}
    class:border-b-[1px]={!vertical}
    class:show={!$tab_bar_collapsed}
  >
    {#each names as name}
      <TabName {name} {tab_size} />
    {/each}
  </div>

  <div class="tab-contents">
    <Button
      style={"margin: 0 auto; " +
        "border: 1px solid #aaa; " +
        "border-radius: 2px; " +
        "position: absolute; " +
        (vertical
          ? "left: 0; top: 50%; transform: translateY(-50%);"
          : "left: 50%; top: 0; transform: translateX(-50%); ") +
        "z-index: 100;"}
      active_color="transparent"
      color="transparent"
      width="auto"
      height="auto"
      on:click={() => {
        $tab_bar_collapsed = !$tab_bar_collapsed;
      }}
    >
      {#if vertical}
        .<br />
        .<br />
        .
      {:else}
        ...
      {/if}
    </Button>

    <slot />
  </div>
</div>

<style lang="scss">
  div.tab-container {
    display: flex;

    div.tab-bar {
      display: flex;

      transition: all 0.75s;
      overflow: hidden;

      opacity: 0;

      &.show {
        opacity: 1;
      }
    }

    & {
      flex-direction: column;

      div.tab-bar {
        height: 0px;
        width: auto;
        &.show {
          margin: 5px 0px;
          padding-bottom: 5px;
          height: 50px;
        }
      }
    }

    &.vertical {
      flex-direction: row;

      div.tab-bar {
        flex-direction: column;
        width: 0px;
        height: 100%;
        &.show {
          margin: 0px 5px;
          border-width: 0px 1px 0px 0px;
          width: 200px;
        }
      }
    }

    div.tab-contents {
      position: relative;
      padding: 7px;
      flex: 1 1 auto;
    }
  }
</style>
