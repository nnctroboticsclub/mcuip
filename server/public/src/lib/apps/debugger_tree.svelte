<script lang="ts">
  import type { Writable } from "svelte/store";
  import Toggle from "$lib/components/ui/toggle.svelte";
  import { PropertyWritable } from "$lib/stores/property_writable";

  export let object: Writable<object>;
  export let key: string | null = null;
</script>

{#if typeof $object === "string"}
  {key}: {$object}
{:else if typeof $object === "number"}
  {key}: N;{object}
{:else if typeof $object === "boolean"}
  {key} <Toggle bind:value={$object} />
{:else if typeof $object === "function"}
  {key}: &lt;Function&gt;
{:else if typeof $object === "undefined"}
  {key}: undefined
{:else if Object.hasOwn($object, "subscribe")}
  <svelte:self {key} bind:object={$object} />
{:else}
  {#if key}
    {key}/
  {:else}
    /
  {/if}
  <div class="object">
    {#each Object.entries($object) as [key]}
      <svelte:self {key} object={new PropertyWritable(object, key)} /><br />
    {/each}
  </div>
{/if}

<style>
  div.object {
    margin-left: 10px;
    position: relative;
  }
  div.object::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 0px;
    height: 100%;
    width: 1px;
    background-color: gray;
  }
</style>
