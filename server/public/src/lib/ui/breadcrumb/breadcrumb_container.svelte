<script lang="ts">
  import type { ComponentType } from "svelte";
  import BreadCrumbContext from "./breadcrumb";
  import { derived } from "svelte/store";

  export let root: ComponentType;

  const ctx = BreadCrumbContext.newContext();
  ctx.add("-", root, {});

  const item = ctx.getItem();

  const component = derived(item, (i) => i.component);
  const props = derived(item, (i) => i.props);
</script>

<slot></slot>

<svelte:component this={$component} {...$props}></svelte:component>
