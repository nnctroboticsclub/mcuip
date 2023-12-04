<script lang="ts">
  import Window from "../window/window.svelte";
  import { shared_data } from "$lib/shared_data/global";
  import GlobalDataListPart from "./global_data_list_part.svelte";

  const store = shared_data.dataListStore();
</script>

<Window>
  <svelte:fragment slot="title">Global Data List</svelte:fragment>
  <svelte:fragment slot="app">
    {#each $store as item}
      <GlobalDataListPart key={item.key} value={item.value} />
    {/each}
  </svelte:fragment>
</Window>
