<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import Window from "../window/window.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TextInput from "$lib/ui/text_input.svelte";

  const data = getWindow().getDataStore<string>("ip");
  if (!$data) {
    data.set("");
  }
</script>

<Window>
  <svelte:fragment slot="title">McuIp Controller</svelte:fragment>
  <svelte:fragment slot="app">
    <TabContainer names={["Connection", "Device status"]} tag="main-tab">
      <TabContent name="Connection"></TabContent>
      <TextInput bind:value={$data} />
      <TabContent name="Device status"></TabContent>
    </TabContainer>
  </svelte:fragment>
</Window>
